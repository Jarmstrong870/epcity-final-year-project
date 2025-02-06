from Repository.groupChatRepo import GroupChatRepo

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
        """ Send a message in a group. """
        return GroupChatRepo.insert_message(group_id, content, sender_email)


