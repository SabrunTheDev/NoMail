require("dotenv").config();
const { Client } = require("@notionhq/client");
const { createPromptModule } = require("inquirer");

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

// Create the prompt instance
const prompt = createPromptModule();

// Function to send a message
async function sendMail() {
  const answers = await prompt([
    { name: "sender", message: "Sender:" },
    { name: "recipient", message: "Recipient:" },
    { name: "message", message: "Message:" },
  ]);

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Message: { title: [{ text: { content: answers.message } }] },
        Sender: { rich_text: [{ text: { content: answers.sender } }] },
        Recipient: { rich_text: [{ text: { content: answers.recipient } }] },
        Timestamp: {
          date: { start: answers.timestamp || new Date().toISOString() },
        },
      },
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Function to read messages for a specific recipient
async function readMail() {
  const { user } = await prompt([{ name: "user", message: "Recipient:" }]);

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Recipient",
        rich_text: { equals: user },
      },
    });

    if (response.results.length === 0) {
      console.log("No messages found!");
    } else {
      console.log(`Messages for ${user}:`);
      response.results.forEach((page, index) => {
        const sender =
          page.properties.Sender.rich_text[0]?.text.content || "Unknown";
        const message =
          page.properties.Message.title[0]?.text.content || "No message";
        const timestamp =
          page.properties.Timestamp?.date?.start || "No timestamp";
        console.log(
          `${
            index + 1
          }. From: ${sender} (at ${timestamp})\n   Message: ${message}`
        );
      });
    }
  } catch (error) {
    console.error("Error reading messages:", error);
  }
}

// Function to delete a message
async function deleteMail() {
  console.log("Fetching messages...");

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    if (response.results.length === 0) {
      console.log("No messages found to delete.");
      return;
    }

    const choices = response.results.map((page) => ({
      name: `${page.properties.Message.title[0]?.text.content} (From: ${page.properties.Sender.rich_text[0]?.text.content})`,
      value: page.id,
    }));

    const { messageId } = await prompt([
      {
        type: "list",
        name: "messageId",
        message: "Select the message to delete:",
        choices: choices,
      },
    ]);

    const { confirm } = await prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to delete this message?",
      },
    ]);

    if (!confirm) {
      console.log("Deletion cancelled.");
      return;
    }

    await notion.pages.update({
      page_id: messageId,
      archived: true,
    });

    console.log("Message deleted successfully!");
  } catch (error) {
    console.error("Error deleting message:", error);
  }
}

// CLI Menu
async function main() {
  console.log("Welcome to NotionMail!");

  // Update to use prompt correctly for inquirer v12+
  const { action } = await prompt([
    {
      type: "list",
      name: "action",
      message: "Select an option:",
      choices: ["send", "read", "delete"],
    },
  ]);

  if (action === "send") {
    await sendMail();
  } else if (action === "read") {
    await readMail();
  } else if (action === "delete") {
    await deleteMail();
  }
}

main().catch(console.error);
