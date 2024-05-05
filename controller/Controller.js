const Emigration = require('../model/EmigrationModel');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'deoh2klap',
    api_key: '744452359972383',
    api_secret: 'FdEG20XBQzSLdTItlC-AtuSwdGE'
});

function generateUIC() {
    // Fixed UIC for Canada (just an example)
    const fixedUIC = "UIC";

    // Generate two random numbers between 1000 and 9999
    const randomNumber1 = Math.floor(Math.random() * 9000) + 1000;
    const randomNumber2 = Math.floor(Math.random() * 9000) + 1000;

    // Combine the fixed UIC and random numbers with dashes
    const uic = `${fixedUIC}-${randomNumber1}-${randomNumber2}`;

    return uic;
}


exports.CreateEmigration = async (req, res) => {
    console.log("i am hit",req.body)
    try {
        const { salutation, validityDate, surName, GivenName, Nationality, DOB, Address, State, Pincode, PhoneNumber, PassportNumber, CountryOfPassport, ExpiryDate, TypeOfVisa, issuedDateType, CompanyName } = req.body;

        const emptyFields = [];

        // Check each field individually and push the empty ones to the emptyFields array
        if (!salutation) {
            emptyFields.push('salutation');
        }
        if (!validityDate) {
            emptyFields.push('validityDate');
        }
        if (!surName) {
            emptyFields.push('surName');
        }
        if (!GivenName) {
            emptyFields.push('GivenName');
        }
        if (!Nationality) {
            emptyFields.push('Nationality');
        }
        if (!DOB) {
            emptyFields.push('DOB');
        }
        if (!Address) {
            emptyFields.push('Address');
        }
        if (!State) {
            emptyFields.push('State');
        }
        if (!Pincode) {
            emptyFields.push('Pincode');
        }
        if (!PhoneNumber) {
            emptyFields.push('PhoneNumber');
        }
        if (!PassportNumber) {
            emptyFields.push('PassportNumber');
        }
        if (!CountryOfPassport) {
            emptyFields.push('CountryOfPassport');
        }
        if (!ExpiryDate) {
            emptyFields.push('ExpiryDate');
        }
        if (!TypeOfVisa) {
            emptyFields.push('TypeOfVisa');
        }
        if (!issuedDateType) {
            emptyFields.push('issuedDateType');
        }
        if (!CompanyName) {
            emptyFields.push('CompanyName');
        }

        // If there are any empty fields, return a 400 response with a message
        if (emptyFields.length > 0) {
            console.log(`Empty fields: ${emptyFields.join(', ')}`)
            return res.status(400).json({ error: `Empty fields: ${emptyFields.join(', ')}` });
        }

        const passportImage = req.files['passportImage'] ? req.files['passportImage'][0] : undefined;
        const panCardImage = req.files['panCardImage'] ? req.files['panCardImage'][0] : undefined;
        const photo = req.files['photo'] ? req.files['photo'][0] : undefined;

        // Check if any of the files are undefined
        if (!passportImage || !panCardImage || !photo) {
            return res.status(400).json({ error: "One or more files are missing" });
        }

        let passportResult, panCardResult, photoResult;

        try {
            // Upload files to Cloudinary
            passportResult = await cloudinary.uploader.upload(passportImage.path, { folder: "passport_images" });
            panCardResult = await cloudinary.uploader.upload(panCardImage.path, { folder: "pan_card_images" });
            photoResult = await cloudinary.uploader.upload(photo.path, { folder: "profile_photos" });
        
            // Proceed with saving URLs to the database
        } catch (error) {
            console.error("Error uploading files to Cloudinary:", error);
            return res.status(500).json({ error: "Error uploading files to Cloudinary" });
        }

        // Create a new Emigration instance with uploaded file URLs
        const emigration = new Emigration({
            salutation,
            DOB,
            validityDate,
            Address,
            State,
            Pincode,
            PhoneNumber,
            CountryOfPassport,
            surName,
            GivenName,
            Nationality,
            PassportNumber,
            ExpiryDate,
            TypeOfVisa,
            issuedDateType,
            issuedDate: issuedDateType ? new Date() : null,
            CompanyName,
            UicNo: generateUIC(),
            PassportUrl: passportResult.secure_url,
            PanCardUrl: panCardResult.secure_url,
            PhotoUrl: photoResult.secure_url
        });

            console.log(emigration)
        // Save the emigration record to the database
        await emigration.save();
        // res.redirect('/)
        // Redirect to success page
        res.redirect('https://demoemmigration.netlify.app/success');
    } catch (error) {
        console.error("Error processing request:", error);
        // res.status(500).json({ error: "Internal server error" });
        res.redirect('https://demoemmigration.netlify.app/failed');
    }
};
