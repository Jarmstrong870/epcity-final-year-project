import psycopg2
import os

# Database connection configuration
db_config = {
    "host": os.getenv("DATABASE_HOST"),
    "port": os.getenv("DATABASE_PORT"),
    "database": os.getenv("DATABASE_NAME"),
    "user": os.getenv("DATABASE_USER"),
    "password": os.getenv("DATABASE_PASSWORD"),
}

class GroupChatRepo:
    """
    Repository for handling group chat database operations.
    """

    @staticmethod
    def get_groups_by_user_email(user_email):
        """
        Retrieve all groups where the user is a member.
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT g.group_id, g.name, g.created_at 
                FROM groups g
                JOIN group_members gm ON g.group_id = gm.group_id
                JOIN users u ON gm.user_id = u.user_id
                WHERE u.email_address = %s;
                """,
                (user_email,)
            )
            groups = cursor.fetchall()
            return [{"group_id": group[0], "name": group[1], "created_at": group[2]} for group in groups]
        finally:
            cursor.close()
            connection.close()


    @staticmethod
    def create_new_group(group_name, members, creator_email):
        """
        Create a new group chat and add members.

        :param group_name: Name of the new group
        :param members: List of user emails
        :param creator_email: Email of the group creator
        :return: Created group details
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Insert new group and get its ID
            cursor.execute(
                "INSERT INTO groups (name, created_by) VALUES (%s, (SELECT user_id FROM users WHERE email_address = %s)) RETURNING group_id;",
                (group_name, creator_email),
            )
            group_id = cursor.fetchone()[0]

            if creator_email not in members:
                 members.append(creator_email)

            # Add members to the group
            for member_email in members:
                cursor.execute(
                    """
                    INSERT INTO group_members (group_id, user_id, joined_at)
                    VALUES (%s, (SELECT user_id FROM users WHERE email_address = %s), NOW());
                    """,
                    (group_id, member_email),
                )

            connection.commit()
            return {"group_id": group_id, "name": group_name}
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def insert_message(group_id, content, sender_email):
        """
        Insert a new message into the group chat.
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # ✅ Fetch the sender's user_id from email
            cursor.execute("SELECT user_id FROM users WHERE email_address = %s;", (sender_email,))
            sender_id = cursor.fetchone()

            if not sender_id:
                return {"error": "Sender email not found in database"}, 400

            sender_id = sender_id[0]  # Extract user_id

            # ✅ Insert message into `group_messages`
            cursor.execute(
                """
                INSERT INTO group_messages (group_id, sender_id, content, sent_at)
                VALUES (%s, %s, %s, NOW())
                RETURNING message_id, content, sent_at;
                """,
                (group_id, sender_id, content),
            )
            message = cursor.fetchone()
            connection.commit()

            return {
                "message_id": message[0],
                "content": message[1],
                "sent_at": message[2].isoformat(),
                "sender_id": sender_id
                
            }
        except Exception as e:
            print(f"❌ Database Insert Error: {e}")
            return {"error": str(e)}
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_group_messages(group_id):
        """
        Retrieve all messages from a group chat.

        :param group_id: ID of the group chat
        :return: List of messages
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()
            cursor.execute(
                """
               SELECT gm.message_id,
                      gm.content,
                      gm.sent_at,
                      u.user_id AS sender_id,
                      u.email_address AS sender_email
               FROM group_messages gm
               JOIN users u ON gm.sender_id = u.user_id
               WHERE gm.group_id = %s
               ORDER BY gm.sent_at ASC;
           """,
                (group_id,),
            )
            messages = cursor.fetchall()
            return [
                {"message_id": msg[0], "content": msg[1], "sent_at": msg[2].isoformat(), "sender_email": msg[3]}
                for msg in messages
            ]
        finally:
            cursor.close()
            connection.close()



