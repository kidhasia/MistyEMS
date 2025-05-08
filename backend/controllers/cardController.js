// controllers/cardController.js
import Card from '../models/cardModel.js';

export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error: error.message });
  }
};

export const createCard = async (req, res) => {
  try {
    const newCard = new Card(req.body);
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(400).json({ message: 'Error creating card', error: error.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: 'Error updating card', error: error.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card', error: error.message });
  }
};