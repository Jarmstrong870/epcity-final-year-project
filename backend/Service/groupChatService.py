from Repository.groupChatRepo import GroupChatRepo
from better_profanity import profanity

class GroupChatService:
    """
    Business logic for handling group chats.
    """

    @staticmethod
    def create_group(group_name, members, creator_email):
        """ Create a new group and add members. """
        return GroupChatRepo.create_new_group(group_name, members, creator_email)

    @staticmethod
    def get_groups(user_email):
        """ Retrieve user's groups. """
        return GroupChatRepo.get_groups_by_user_email(user_email)

    @staticmethod
    def get_group_messages(group_id):
        """ Retrieve messages for a group. """
        return GroupChatRepo.get_group_messages(group_id)

    @staticmethod
    def send_group_message(group_id, content, sender_email):
        # If message contains profanity, reject it
        if profanity.contains_profanity(content):
            return {"error": "Your message contains inappropriate content and cannot be sent."}, 400
        

        new_message = GroupChatRepo.insert_message(group_id, content, sender_email)
        return new_message, 201  # Only valid messages get 201

    @staticmethod
    def send_property_to_group(group_id, sender_email, property_url):
        """
        Sends a property link to the group chat as a message.
        """
        message_content = f"🏡 New Property Shared! Check it out: {property_url}"
        return GroupChatRepo.insert_message(group_id, message_content, sender_email)
    
    @staticmethod
    def send_group_property(group_id, property_url, sender_email):
        """ Send a property URL to a group chat. """
        message_content = f"🏡 Check out this property: {property_url}"
        return GroupChatRepo.insert_message(group_id, message_content, sender_email)


