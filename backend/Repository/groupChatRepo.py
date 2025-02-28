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
        Insert a new message into the group chat and return sender details.
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # ✅ Fetch the sender's user_id from email
            cursor.execute("SELECT user_id, firstname, profile_image_url FROM users WHERE email_address = %s;", (sender_email,))
            sender_data = cursor.fetchone()

            if not sender_data:
                return {"error": "Sender email not found in database"}, 400

            sender_id, sender_name, profile_image_url = sender_data

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
                "sender_id": sender_id,
                "sender_name": sender_name,  # ✅ Include sender's name
                "profile_image_url": profile_image_url if profile_image_url else "/default-profile.png"  # ✅ Include profile picture
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
        Retrieve all messages from a group chat along with sender details.
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
                    u.firstname AS sender_name,
                    u.profile_image_url
                FROM group_messages gm
                JOIN users u ON gm.sender_id = u.user_id
                WHERE gm.group_id = %s
                ORDER BY gm.sent_at ASC;
                """,
                (group_id,),
            )
            messages = cursor.fetchall()
            return [
                {
                    "message_id": msg[0],
                    "content": msg[1],
                    "sent_at": msg[2].isoformat(),
                    "sender_id": msg[3],
                    "sender_name": msg[4],  # Fetching sender name
                    "profile_image_url": msg[5] if msg[5] else "/default-profile.png",  # Fallback if no image
                }
                for msg in messages
            ]
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def delete_group_data(group_id, user_email):
        """
        Deleting an existing group and all messages.

        :param group_id: ID of the group
        :param user_email: Email of user deleting group
        :return: Success/ Failure group deletion details
        """

        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Selecting membership ID in group members table based on group and user ID
            cursor.execute(
                """
                SELECT user_id FROM users WHERE email_address = %s;
                """, 
                (user_email, ),
            )

            user_id = cursor.fetchone()

            if not user_id:
                return {"error": "Email not able to be found"}
            
            # Selecting membership ID in group members table based on group and user ID
            cursor.execute(
                """
                SELECT user_id FROM group_members
                WHERE group_id = %s
                ORDER BY membership_id ASC
                LIMIT 1;
                """,
                (group_id,),
            )

            admin_number = cursor.fetchone()

            if not admin_number:
                return {"error": "No group is found/ group is empty with 0 members"}
            
            if admin_number[0] != user_id[0]:
                return {"error": "Only the admin is able to delete this group"}, 403

            # Deleting membership ID in group members table based on group and user ID
            cursor.execute("DELETE FROM group_messages WHERE group_id = %s;", (group_id,))

            cursor.execute("DELETE FROM group_members WHERE group_id = %s;", (group_id,))

            cursor.execute("DELETE FROM groups WHERE group_id = %s;", (group_id,))
            
            connection.commit()
            return {"message": "The group and the data has all been deleted successfully"}
        
        
        finally:
            cursor.close()
            connection.close()

        
    @staticmethod
    def edit_group_name(group_id, updated_group_name, user_email):
        """
        Editting the existing group name.

        :param group_id: Name of the new group
        :param updated_name: Update name of the group
        :param user_email: List of user emails
        :return: New group name
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Selecting user ID in users table based on email address
            cursor.execute(
                """
                SELECT user_id FROM users WHERE email_address = %s;
                """, 
                (user_email, ),
            )

            user_id = cursor.fetchone()

            if not user_id:
                return {"error": "email not able to be found"}
            
            # Selecting membership ID in group members table based on group and user ID
            cursor.execute(
                """
                SELECT membership_id FROM group_members
                WHERE group_id = %s
                AND user_id = %s;
                """,
                (group_id, user_id[0]),
            )

            group_member_id = cursor.fetchone()

            if not group_member_id:
                return {"error": "you need to be a member of this group to edit the name"}
            
            # Updating group name within the groups table
            cursor.execute(
                """
                UPDATE groups SET name = %s
                WHERE group_id = %s;
                """,
                (updated_group_name, group_id),
            )

            connection.commit()
            return {"message": "This group and the data has all been deleted successfully"}
        
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def exit_group(group_id, user_email):
        """
        Existing team member will remove themselves from a group.

        :param group_id: Name of the new group
        :param user_email: List of user emails
        :return: Success/Failure team member removal details
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            # Selecting user ID matching an email address in users table
            cursor.execute(
                """
                SELECT user_id FROM users WHERE email_address = %s;
                """, 
                (user_email, ),
            )

            user_id = cursor.fetchone()

            if not user_id:
                return {"error": "user is not saved in the database"}
            
            # Selecting membership ID in group members table based on group and user ID
            cursor.execute(
                """
                SELECT membership_id FROM group_members
                WHERE group_id = %s
                AND user_id = %s;
                """,
                (group_id, user_id[0]),
            )

            group_member_status = cursor.fetchone()

            if not group_member_status:
                return {"error", "member can't be found in this group"}
            
            # Deleting user in group members table by matching the group and user ID
            cursor.execute(
                """
                DELETE FROM group_members
                WHERE group_id = %s
                AND user_id = %s;
                """,
                (group_id, user_id[0]),
            )

            connection.commit()
            return {"message": "Successfully left from the group"}
        
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_group_members(group_id):
        """
        Retrieve all members and their details found within a group.
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT u.user_id, u.firstname, u.email_address 
                FROM users u
                JOIN group_members gm ON u.user_id = gm.user_id
                WHERE gm.group_id = %s;
                """,
                (group_id,)
            )
            groups = cursor.fetchall()
            return [{"user_id": group[0], "firstname": group[1], "email_address": group[2]} for group in groups]
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def search_group_message(group_id, search_message):
        """
        Retrieve all messages from a group chat along with sender details after a search is carried out
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
                    u.firstname AS sender_name,
                    u.profile_image_url
                FROM group_messages gm
                JOIN users u ON gm.sender_id = u.user_id
                WHERE gm.group_id = %s
                AND gm.content ILIKE %s
                ORDER BY gm.sent_at ASC;
                """,
                (group_id, search_message),
            )
            
            searched_messages = cursor.fetchall()

            return [
                {
                    "message_id": search_msg[0], 
                    "content": search_msg[1],
                    "sent_at": search_msg[2].isoformat(),
                    "sender_id": search_msg[3],
                    "sender_name": search_msg[4],  # Fetching sender name
                    "profile_image_url": search_msg[5] if search_msg[5] else "/default-profile.png",  # Fallback if no image
                }
                for search_msg in searched_messages
            ]
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def add_new_member(group_id, user_email):
        """
        Insert a new member into the group chat and update team details.
        """
        try:
            connection = psycopg2.connect(**db_config)
            cursor = connection.cursor()

            cursor.execute("SELECT user_id, firstname, profile_image_url FROM users WHERE email_address = %s;", (user_email,))
            user_data = cursor.fetchone()

            if not user_data:
                return {"error": "User email not found in database"}, 400

            user_id = user_data[0]

            cursor.execute(
                """
                INSERT INTO group_members (group_id, user_id)
                VALUES (%s, %s)
                RETURNING membership_id
                """,
                (group_id, user_id),
            )
            connection.commit()

            return {
                "user_id": user_id,
            }
        except Exception as e:
            print(f"Database Insert Error: {e}")
            return {"error": str(e)}
        finally:
            cursor.close()
            connection.close()
