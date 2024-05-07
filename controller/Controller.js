const Emigration = require('../model/EmigrationModel');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'deoh2klap',
    api_key: '744452359972383',
    api_secret: 'FdEG20XBQzSLdTItlC-AtuSwdGE'
});

function generateUIC() {
    // Fixed UIC for Canada (just an example)
    const fixedUIC = "UCI";

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
        const { salutation, validityDate, surName, GivenName,VisaStatus, Nationality, DOB, Address, State, Pincode, PhoneNumber, PassportNumber, CountryOfPassport, ExpiryDate, TypeOfVisa, issuedDateType, CompanyName } = req.body;

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

        console.log(req.files)
        const passportImage = req.files['passportImage'] ? req.files['passportImage'][0] : undefined;
        const panCardImage = req.files['panCardImage'] ? req.files['panCardImage'][0] : undefined;
        const VisaAttached = req.files['VisaAttached'] ? req.files['VisaAttached'][0] : undefined;

        const photo = req.files['photo'] ? req.files['photo'][0] : undefined;

        // Check if any of the files are undefined
        if (!passportImage || !panCardImage || !photo || !VisaAttached) {
            return res.status(400).json({ error: "One or more files are missing" });
        }

        let passportResult, panCardResult, photoResult,VisaResult;

        try {
            // Upload files to Cloudinary
            passportResult = await cloudinary.uploader.upload(passportImage.path, { folder: "passport_images" });
            panCardResult = await cloudinary.uploader.upload(panCardImage.path, { folder: "pan_card_images" });
            photoResult = await cloudinary.uploader.upload(photo.path, { folder: "profile_photos" });
            VisaResult = await cloudinary.uploader.upload(VisaAttached.path, { folder: "VisaAttached" });

        
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
            VisaStatus,
            VisaAttached :VisaResult.secure_url,
            PassportUrl: passportResult.secure_url,
            PanCardUrl: panCardResult.secure_url,
            PhotoUrl: photoResult.secure_url
        });

            console.log(emigration)
        // Save the emigration record to the database
        await emigration.save();
        // res.redirect('/)
        res.status(201).json({ message: "Emigration record created successfully", emigration });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.findByUciNumber = async (req, res) => {
    try {
        const uciNumber = req.params.uci;
        console.log(uciNumber)
        const findData = await Emigration.find({ UicNo: uciNumber });
        if (findData.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No Data Found"
            });
        }
        res.status(200).json({
            success: true,
            msg: "Data found",
            data: findData
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            msg: "Internal Server Error"
        });
        console.log(error);
    }
};


exports.getAllEmigration = async (req, res) => {
    try {
        const emigrations = await Emigration.find();
        res.status(200).json(emigrations);
    } catch (error) {
        console.error("Error fetching emigrations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.singleEmigration = async (req, res) => {
    try {
        const emigration = await Emigration.findById(req.params.id);
        if (!emigration) {
            return res.status(404).json({ error: "Emigration not found" });
        }
        res.status(200).json(emigration);
    } catch (error) {
        console.error("Error fetching emigration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteEmigration = async (req, res) => {
    try {
        const emigration = await Emigration.findByIdAndDelete(req.params.id);
        if (!emigration) {
            return res.status(404).json({ error: "Emigration not found" });
        }
        res.status(200).json({ message: "Emigration deleted successfully" });
    } catch (error) {
        console.error("Error deleting emigration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const cron = require('node-cron');

exports.downloadEmigration = async (req, res) => {
    try {
        // Fetch emigration data from the database
        const emigrations = await Emigration.find();

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Emigration Data');

        // Add headers
        worksheet.addRow([
            'SurName', 'GivenName', 'Nationality', 'DOB', 'Address', 'State', 'Pincode', 'PhoneNumber',
            'PassportNumber', 'CountryOfPassport', 'ExpiryDate', 'TypeOfVisa','VisaStatus', 'issuedDateType', 'CompanyName',
            'UicNo', 'PassportUrl', 'PhotoUrl', 'Visa-Approval-Letter','Visa-Attached-passport',
        ]);

        // Add data rows
        emigrations.forEach((emigration) => {
            worksheet.addRow([
                emigration.surName, emigration.GivenName, emigration.Nationality, emigration.DOB, emigration.Address,
                emigration.State, emigration.Pincode, emigration.PhoneNumber, emigration.PassportNumber,
                emigration.CountryOfPassport, emigration.ExpiryDate, emigration.TypeOfVisa,emigration.VisaStatus, emigration.issuedDateType,,
                emigration.CompanyName, emigration.UicNo, emigration.PassportUrl, emigration.PhotoUrl, emigration.PanCardUrl,emigration.VisaAttached
            ]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="emigration_data.xlsx"');

        // Write workbook to response
        await workbook.xlsx.write(res);

        // End response
        res.end();
    } catch (error) {
        console.error("Error downloading emigration data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
cron.schedule('0 0 * * *', async () => {
    try {
        // Calculate the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find and delete emigration records older than 30 days
        const result = await Emigration.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });

        console.log(`Deleted ${result.deletedCount} emigration records older than 30 days.`);
    } catch (error) {
        console.error('Error deleting emigration records:', error);
    }
});