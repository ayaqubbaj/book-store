
  ///////////
  /*const express = require("express");
  const router = express.Router();
  const asyncHandler = require("express-async-handler");
  const { User } = require("../models/User");
  
  // POST /api/connection - Send a connection request
  router.post("/", asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.body;
  
    // Validation: Ensure senderId and receiverId are present
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'SenderId and ReceiverId are required' });
    }
  
    try {
      // Find sender and receiver by their respective IDs
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
  
      if (!sender || !receiver) {
        return res.status(404).json({ error: 'Sender or receiver not found' });
      }
  
      // Check if the connection property exists for sender
      if (!sender.connections) {
        sender.connections = []; // Initialize connections as an empty array if it doesn't exist
      }
  
      // Check if the connection request has already been sent
      if (sender.connections.includes(receiverId)) {
        return res.status(400).json({ error: 'Connection request already sent' });
      }
  
      // Send connection request
      sender.connections.push(receiverId);
      console.log('Updated Sender:', sender); // Log the sender object after making changes
  
      try {
        const savedSender = await sender.save(); // Save changes to sender's connections
        console.log('Saved Sender:', savedSender); // Log the saved sender object
      } catch (err) {
        console.error('Error saving sender:', err);
        return res.status(500).json({ error: 'Failed to save sender data' });
      }
  
      res.json({ message: 'Connection request sent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }));
  
  module.exports = router;
  */
  const express = require("express");
  const router = express.Router();
  const asyncHandler = require("express-async-handler");
  const { User } = require("../models/User");
  
  // POST /api/connection - Send a connection request
  router.post("/", asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.body;
  
    // Validation: Ensure senderId and receiverId are present
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'SenderId and ReceiverId are required' });
    }
  
    try {
      // Find sender and receiver by their respective IDs
      const sender = await User.findById(senderId).populate('connections', '-password'); // Populate connections with user info, excluding password field
      const receiver = await User.findById(receiverId);
  
      if (!sender || !receiver) {
        return res.status(404).json({ error: 'Sender or receiver not found' });
      }
  
      // Check if the connection property exists for sender
      if (!sender.connections) {
        sender.connections = []; // Initialize connections as an empty array if it doesn't exist
      }
  
      // Check if the connection request has already been sent
      if (sender.connections.find(connection => connection._id.toString() === receiverId)) {
        return res.status(400).json({ error: 'Connection request already sent' });
      }
  
      // Send connection request
      sender.connections.push(receiver);
      console.log('Updated Sender:', sender); // Log the sender object after making changes
  
      try {
        const savedSender = await sender.save(); // Save changes to sender's connections
        console.log('Saved Sender:', savedSender); // Log the saved sender object
      } catch (err) {
        console.error('Error saving sender:', err);
        return res.status(500).json({ error: 'Failed to save sender data' });
      }
  
      res.json({ message: 'Connection request sent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }));
  
  /*
// POST /api/connection/accept - Accept a connection request
router.post("/accept", asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Validation: Ensure senderId and receiverId are present
  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'SenderId and ReceiverId are required' });
  }

  try {
    // Find sender and receiver by their respective IDs
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    // Check if the sender has sent a connection request to the receiver
    if (!sender.connections.find(connection => connection._id.toString() === receiverId)) {
      return res.status(400).json({ error: 'No pending connection request from the sender' });
    }

    // Accept connection request
    if (!receiver.connections) {
      receiver.connections = []; // Initialize connections as an empty array if it doesn't exist
    }

    receiver.connections.push(sender);
    await receiver.save(); // Save changes to receiver's connections

    // Remove the connection request from the sender's connections array
    sender.connections = sender.connections.filter(connection => connection._id.toString() !== receiverId);
    await sender.save(); // Save changes to sender's connections

    res.json({ message: 'Connection request accepted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

module.exports = router;
  */
 // POST /api/connection/accept - Accept a connection request
router.post("/accept", asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Validation: Ensure senderId and receiverId are present
  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'SenderId and ReceiverId are required' });
  }

  try {
    // Find sender and receiver by their respective IDs
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    // Check if the sender has sent a connection request to the receiver
    if (!sender.connections.find(connection => connection._id.toString() === receiverId)) {
      return res.status(400).json({ error: 'No pending connection request from the sender' });
    }

    // Accept connection request
    if (!receiver.connections) {
      receiver.connections = []; // Initialize connections as an empty array if it doesn't exist
    }

    // Check if the receiver is already connected to the sender
    if (!receiver.connections.find(connection => connection._id.toString() === senderId)) {
      receiver.connections.push(sender); // Add sender to receiver's connections
    }

    await receiver.save(); // Save changes to receiver's connections

    // Respond with a success message or any required response
    res.json({ message: 'Connection request accepted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}));

module.exports = router;
