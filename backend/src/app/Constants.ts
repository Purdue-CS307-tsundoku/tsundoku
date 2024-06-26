const Constants = {
  GOOGLE_BOOKS_API_KEY: process.env.TSUNDOKU_BACKEND_GOOGLE_BOOKS_API_KEY,
  APPWRITE_ENDPOINT: process.env.TSUNDOKU_BACKEND_APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY: process.env.TSUNDOKU_BACKEND_APPWRITE_API_KEY,
  MAIN_DB_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_MAIN_DB_ID,
  BOOK_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_BOOK_COL_ID,
  AUTHOR_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_AUTHOR_COL_ID,
  EDITION_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_EDITION_COL_ID,
  BOOK_STAT_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_BOOKSTATUS_COL_ID,
  REVIEW_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_REVIEW_COL_ID,
  CUSTOM_PROP_TEMPLATE_COL_ID:
    process.env.TSUNDOKU_BACKEND_APPWRITE_CUSTOM_PROP_TEMPLATE_COL_ID,
  CUSTOM_PROP_CATEGORY_COL_ID:
    process.env.TSUNDOKU_BACKEND_APPWRITE_CUSTOM_PROP_CATEGORY_COL_ID,
  CUSTOM_PROP_DATA_COL_ID:
    process.env.TSUNDOKU_BACKEND_APPWRITE_CUSTOM_PROP_DATA_COL_ID,
  FRIEND_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_FRIEND_COL_ID,
  USERDATA_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_USERDATA_COL_ID,
  NOTIFICATION_PREF_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_NOTIFICATION_PREF_COL_ID,
  PRIVATE_NOTES_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_PRIVATE_NOTES_COL_ID,
  REVIEW_VOTES_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_REVIEW_VOTES_ID,
  READING_CHALLENGE_COL_ID: process.env.TSUNDOKU_BACKEND_APPWRITE_READING_CHALLENGE_COL_ID,
};

export default Constants;