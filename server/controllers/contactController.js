const ContactService = require('../services/contactService');

class ContactController {
    // identify method
    static async identify(req, res) {
        try{
            const {email, phoneNumber}= req.body;
            const result=await ContactService.identifyContact(email, phoneNumber);
            res.status(200).json(result);
        }catch(error){
            console.error(`Error - ContactController.identifyContact - ${error}`);
            res.status(500).json({
                error: error.message,
                message: "Internal server error."
            })
        }
    }
}

module.exports = ContactController;