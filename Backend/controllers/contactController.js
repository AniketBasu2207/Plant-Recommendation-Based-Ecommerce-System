const Contact = require('../models/Contact');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create new contact entry
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    res.status(201).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
