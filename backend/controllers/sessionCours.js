import SessionCours from '../models/SessionCours.js';

// Create a new sessionCours
export const createSessionCours = async (req, res) => {
  try {
    const { nomSession, date } = req.body;

    const newSC = new SessionCours({ nomSession, date });

    const savedSC = await newSC.save();
    res.status(201).json(savedSC);
  } catch (error) {
    console.error("Error creating session:", error); // Ajoutez cette ligne pour afficher l'erreur dans la console
    res.status(500).json({ error: 'An error occurred while creating the SessionCours.' });
  }
};


// Get all sessionCours
export const getAllSessionCours = async (req, res) => {
  try {
    const sessionCours = await SessionCours.find();
    res.json(sessionCours);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the sessionCours.' });
  }
};

// Get a specific sessionCoursId by ID
export const getSessionCoursById = async (req, res) => {
  try {
    const { sessionCoursId } = req.params;
    const sessionCours = await SessionCours.findById(sessionCoursId);

    if (!sessionCours) {
      return res.status(404).json({ error: 'sessionCours not found.' });
    }

    res.json(sessionCours);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the sessionCoursId.' });
  }
};

// Update a sessionCours by ID
export const updatesessionCoursById = async (req, res) => {
  try {
    const { sessionCoursId } = req.params;
    const { nomSession } = req.body;
    const { date } = req.body;
    const { apprenants } = req.body;

    

    const updatedsessionCours = await SessionCours.findByIdAndUpdate(
      sessionCoursId,
      { nomSession },
      { date },
      { apprenants },

      { new: true }
    );

    if (!updatedsessionCours) {
      return res.status(404).json({ error: 'sessionCours not found.' });
    }

    res.json(updatedsessionCours);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the sessionCours.' });
  }
};

// Delete a sessionCours by ID
export const deletesessionCoursById = async (req, res) => {
  try {
    const { sessionCoursId } = req.params;
    const deletedsessionCours = await SessionCours.findByIdAndDelete(sessionCoursId);

    if (!deletedsessionCours) {
      return res.status(404).json({ error: 'sessionCours not found.' });
    }

    res.json('sessionCours deleted succesufully.');
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the sessionCours.' });
  }
};
