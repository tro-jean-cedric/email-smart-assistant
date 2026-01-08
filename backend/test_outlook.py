import win32com.client
import os

def test_outlook_connection():
    try:
        print("Attempting to connect to Outlook...")
        outlook = win32com.client.Dispatch("Outlook.Application")
        namespace = outlook.GetNamespace("MAPI")
        
        # Access Inbox (6 is the default folder ID for Inbox)
        inbox = namespace.GetDefaultFolder(6)
        
        print(f"Successfully connected to Outlook!")
        print(f"User: {namespace.CurrentUser}")
        print(f"Inbox Name: {inbox.Name}")
        print(f"Total Items in Inbox: {inbox.Items.Count}")
        
        # Try to read the last 3 emails
        messages = inbox.Items
        messages.Sort("[ReceivedTime]", True) # Descending sort
        
        print("\n--- Last 3 Emails ---")
        for i in range(min(3, messages.Count)):
            msg = messages[i]
            try:
                print(f"Subject: {msg.Subject}")
                print(f"Sender: {msg.SenderName}")
                print(f"Received: {msg.ReceivedTime}")
                print("-" * 20)
            except Exception as e:
                print(f"Error reading message {i}: {e}")
                
    except Exception as e:
        print(f"FAILED to connect or read from Outlook.")
        print(f"Error: {e}")

if __name__ == "__main__":
    test_outlook_connection()
