const {Op}=require('sequelize');
const Contact=require('../models/contactModel');

class ContactService{
    //identifyContact method
    static async identifyContact(email, phoneNumber){
        const [existingContact, created]= await Contact.findOrCreate(
            {
                where:{
                    [Op.or]:[
                        {email:email || null},
                        {phoneNumber: phoneNumber || null}
                    ]
                },
                defaults:{
                    email,
                    phoneNumber,
                    linkPrecedence: 'primary'
                }
            });
            if(created){
                return ContactService.formatResponse(existingContact);
            }
            const allRelatedContacts = await Contact.findAll({
                where: {
                  [Op.or]: [
                    { id: existingContact.id },
                    { linkedId: existingContact.id },
                    { id: existingContact.linkedId },
                    { linkedId: existingContact.linkedId }
                  ]
                },
                order: [['createdAt', 'ASC']]
              });

              const primaryContact = allRelatedContacts.find(contact => contact.linkPrecedence === 'primary') || allRelatedContacts[0];
              const secondaryContacts = allRelatedContacts.filter(contact => contact.id !== primaryContact.id);
      
              // Update all contacts to ensure correct linking
              await Promise.all(secondaryContacts.map(contact => 
                  contact.update({ linkedId: primaryContact.id, linkPrecedence: 'secondary' })
              ));
      
              // Check if we need to create a new secondary contact
              const newInfoExists = !allRelatedContacts.some(contact => 
                  (email && contact.email === email) || (phoneNumber && contact.phoneNumber === phoneNumber)
              );
      
              if (newInfoExists) {
                  const newContact = await Contact.create({
                      email,
                      phoneNumber,
                      linkedId: primaryContact.id,
                      linkPrecedence: 'secondary'
                  });
                  secondaryContacts.push(newContact);
              }
        return this.formatResponse(primaryContact, secondaryContacts);
    }
    // formatResponce method
    static formatResponse(primaryContact, secondaryContact=[]){
        const allContacts=[primaryContact, ...secondaryContact];
        const emails=[...new Set(allContacts.map(contact=>contact.email).filter(Boolean))];
        const phoneNumbers=[...new Set(allContacts.map(contact=>contact.phoneNumber).filter(Boolean))];
        return{
            contact:{
                primaryContactId: primaryContact.id,
                emails:emails,
                phoneNumbers:phoneNumbers,
                secondaryContactIds: secondaryContact.map(contact=>contact.id),
            }
        };
    }
}

module.exports=ContactService;