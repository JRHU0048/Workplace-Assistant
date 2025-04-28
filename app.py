from flask import Flask, request, jsonify
import pymysql
from datetime import datetime
from flask_cors import CORS
from openai import OpenAI
import os
import bcrypt

# 配置DeepSeek API
DEEPSEEK_API_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # API密钥
client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com/v1")

app = Flask(__name__)
CORS(app)

# 数据库配置
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'XXXXXXXXX',
    'database': 'career_helper',
    'charset': 'utf8mb4'
}

def get_db_connection():
    return pymysql.connect(**db_config)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 检查用户是否存在
        cursor.execute("SELECT id, password FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user:
            stored_password = user[1].encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), stored_password):
                return jsonify({'code': 200, 'message': '登录成功', 'username': username})
            else:
                return jsonify({'code': 401, 'message': '用户名或密码错误'})
        else:
            # 用户不存在，执行注册逻辑
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s)",
                (username, hashed_password.decode('utf-8'))
            )
            conn.commit()
            return jsonify({'code': 200, 'message': '注册并登录成功', 'username': username})
    except Exception as e:
        conn.rollback()
        return jsonify({'code': 500, 'message': str(e)})
    finally:
        cursor.close()
        conn.close()

@app.route('/api/ask', methods=['POST'])
def ask_question():
    data = request.json
    # print("接收到的请求数据:", data)  # 调试日志
    username = data.get('username')
    question = data.get('question')

    # 调试用
    # if not username:
        # return jsonify({'code': 400, 'message': 'username 不能为空'})
    
    try:
        # 调用DeepSeek API
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个专业的职场助手，你的名字是小鲸鱼，用中文回答用户的职场相关问题"},
                {"role": "user", "content": question}
            ],
            temperature=0.7
        )
        
        answer = response.choices[0].message.content
        
        # 保存到数据库
        # if username:
        save_to_database(username, question, answer)
            
        return jsonify({'code': 200, 'answer': answer})
        
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e)})

@app.route('/api/history', methods=['GET'])
def get_history():
    # print("接收到的参数:", request.args)  # 调试
    username = request.args.get('username')
    # limit = request.args.get('limit', 20)
    limit = int(request.args.get('limit', 20))  # 强制转换
    
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    try:
        cursor.execute(
            "SELECT question, answer, created_at FROM qa_records WHERE username = %s ORDER BY created_at DESC LIMIT %s",
            (username, limit)
        )
        records = cursor.fetchall()
        # print(f"查询结果: {records}")  # 调试输出

        if not records:  # 明确处理空结果
            print(f"用户 {username} 无历史记录")
            return jsonify({'code': 200, 'data': [], 'message': '无历史记录'})

        return jsonify({'code': 200, 'data': records})
    except Exception as e:
        print(f"数据库操作失败: {str(e)}")  # 输出完整错误
        # print("失败")
        return jsonify({'code': 500, 'message': str(e)})
    finally:
        cursor.close()
        conn.close()

# 将问题和回答保存到数据库
def save_to_database(username, question, answer):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 获取当前时间
        created_at = datetime.now()
        # 插入数据到 qa_records 表
        cursor.execute(
            "INSERT INTO qa_records (username, question, answer, created_at) VALUES (%s, %s, %s, %s)",
            (username, question, answer, created_at)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"保存到数据库时出错: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)