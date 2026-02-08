module.exports = {
  dbtest: async function (req, res) {
    try {
      // For MongoDB, we check if the manager is reachable
      const db = sails.getDatastore().manager;
      
      // Attempt a simple ping or a find on a collection (e.g., User)
      // If the DB is down, this will throw an error
      await sails.getDatastore().manager.client.db().admin().ping();

      return res.ok({ status: 'MongoDB connected ✅' });
    } catch (err) {
      return res.serverError({ 
        status: 'Database NOT connected ❌', 
        error: err.message 
      });
    }
  }
};