import pymysql
from config import DB_CONFIG

def test_connection():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        print("✅ 数据库连接成功！")
        
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM users")
            count = cursor.fetchone()
            print(f"users 表记录数: {count[0]}")
            
    except Exception as e:
        print(f"❌ 连接失败: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    test_connection()