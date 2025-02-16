# NoMail CLI

## Description

NoMail is a command-line tool that allows users to send, read, and delete messages using the Notion API. Messages are stored in a Notion database and retrieved by recipient. The application provides a simple interface for managing communications within Notion.

### Improvements Implemented

- **Timestamps**: Each message includes a timestamp for better tracking.
- **Message Deletion**: Messages are archived instead of permanently deleted, as per Notion API limitations.
- **Enhanced User Experience**: Users select messages to delete from a list instead of manually entering an ID.

## Installation and Setup

### Prerequisites

- Node.js (v14 or later)
- A Notion API key
- A Notion database with the following properties:
  - `Message` (Title)
  - `Sender` (Rich Text)
  - `Recipient` (Rich Text)
  - `Timestamp` (Date)

### Steps to Install

1. **Install dependencies**:
   ```sh
   npm install
   ```
2. **Set up environment variables**:
   - Create a `.env` file in the project root.
   - Add the following:
     ```env
     NOTION_API_KEY=your_notion_api_key
     NOTION_DATABASE_ID=your_database_id
     ```

## Running the Program

Run the CLI with:

```sh
npm start
```

- **Send a Message:** Enter sender, recipient, and message content.
- **Read Messages:** Retrieve messages for a specific recipient.
- **Delete Messages:** Select a message from a list to archive.

## Future Improvements

- Implement search and filtering features.
- Introduce message threading for better conversation tracking.
- Add support for attachments and media.
- Improve error handling and API request retries.

## Technical Choices

- **Notion API**: Selected for its flexibility in handling structured data.
- **Inquirer.js**: Used for interactive CLI prompts.
- **dotenv**: Manages environment variables securely.
- **Node.js**: Provides an asynchronous and event-driven runtime for optimal CLI performance.

## References

- [Notion API Documentation](https://developers.notion.com/)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/)
- [dotenv Documentation](https://www.npmjs.com/package/dotenv)
- Stack Overflow discussions on Node.js CLI best practices

---

💡 **NoMail – A simple way to manage messages in Notion!**
