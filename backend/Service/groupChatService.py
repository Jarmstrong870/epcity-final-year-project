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
    def delete_group_data(group_id, user_email):
        """ Deletes existing group and all relevant data """
        return GroupChatRepo.delete_group_data(group_id, user_email)
    
    @staticmethod
    def edit_group_name(group_id, updated_name, user_email):
        """ Editing group name of an existing group """
        return GroupChatRepo.edit_group_name(group_id, updated_name, user_email)

    @staticmethod
    def exit_group(group_id, user_email):
        """ Current group memeber can exit from group """
        return GroupChatRepo.exit_group(group_id, user_email)
    
    @staticmethod
    def get_all_group_members(group_id):
        """ Returning all members within a specified group """
        return GroupChatRepo.get_all_group_members(group_id)
    
    @staticmethod
    def search_group_message(group_id, searched_message):
        """ Searching for a term within group chat messages """
        return GroupChatRepo.search_group_message(group_id, searched_message)



