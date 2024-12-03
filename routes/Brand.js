


// const express = require('express');
// const router = express.Router();

// // Import the brand controller functions (including campaign-related ones)
// const { 
//   brandSignUpData, 
//   brandLogin, 
//   brandhome, 
//   getConnectedbrand, 
//   getBrandData, 
//   logoUpload, 
//   updateProfile, 
//   imageUpload, 
//   createCampaign, 
//   getAllCampaigns,
//   getMyCampaigns,
//   applyToCampaign ,
// } = require('../controllers/BrandController'); // All functions come from brandController

// const brandIsAuth = require('../middleware/BrandIsAuth');
// const influencerIsAuth = require('../middleware/InfluencerIsAuth');

// // Test route for checking if everything is set up
// router.get('/', (req, res, next) => {
//   res.send('<h1>hello from brand </h1>');
// });

// //==>> saving signup data POST
// router.post('/signup', brandSignUpData);

// //==>> displaying all brands
// router.get('/getAllbrand', influencerIsAuth.isAuth, brandhome);

// //=> brand login POST
// router.post('/brandlogin', brandLogin);

// //=> get brand data GET
// router.get('/getBrandData', brandIsAuth.isAuth, getBrandData);

// //==> upload logo PUT
// router.put('/logoupload', brandIsAuth.isAuth, logoUpload);

// //==> upload brand images PUT
// router.put('/imageuplaod', brandIsAuth.isAuth, imageUpload);

// //==> update brand profile PUT
// router.put('/updateprofile', brandIsAuth.isAuth, updateProfile);

// //==> get connected brand in influencer detail page POST
// router.post('/getconnectedbrand', getConnectedbrand);

// // Campaign routes
// //==> Create a new campaign POST
// router.post('/createCampaign', createCampaign);

// //==> Get all campaigns GET

// router.get('/getMyCampaigns',brandIsAuth, getMyCampaigns);
// router.get('/getAllCampaigns', getAllCampaigns); // Anyone can view all campaigns (no authentication needed)

// // ==> Apply to a campaign POST (without authentication)
// router.post('/applyToCampaign', applyToCampaign); // New route to apply to a campaign

// module.exports = router;



const express = require('express');
const router = express.Router();

// Import the brand controller functions (including campaign-related ones)
const { 
  brandSignUpData, 
  brandLogin, 
  brandhome, 
  getConnectedbrand, 
  getBrandData, 
  logoUpload, 
  updateProfile, 
  imageUpload, 
  createCampaign, 
  getAllCampaigns,
  getMyCampaigns,
  applyToCampaign , deleteAllCampaigns

} = require('../controllers/BrandController'); // Ensure this import is correct


const { deleteCampaign } = require('../controllers/BrandController');
// Import authentication middleware
const brandIsAuth = require('../middleware/brandIsAuth');
const influencerIsAuth = require('../middleware/influencerIsAuth');

// Test route for checking if everything is set up
router.get('/', (req, res) => {
  res.send('<h1>hello from brand </h1>');
});

//==>> saving signup data POST
router.post('/signup', brandSignUpData);

//==>> displaying all brands (requires influencer authentication)
router.get('/getAllbrand', influencerIsAuth.isAuth, brandhome);
router.delete('/deleteAllCampaigns', deleteAllCampaigns); // Route to delete all campaigns
//==> brand login POST
router.post('/brandlogin', brandLogin);

//==> get brand data GET (requires brand authentication)
router.get('/getBrandData', brandIsAuth.isAuth, getBrandData);

//==> upload logo PUT (requires brand authentication)
router.put('/logoupload', brandIsAuth.isAuth, logoUpload);

//==> upload brand images PUT (requires brand authentication)
// router.put('/imageupload', brandIsAuth.isAuth, imageUpload); // Fixed typo here

router.put('/:brandId/imageupload', imageUpload);
//==> update brand profile PUT (requires brand authentication)
router.put('/updateprofile', brandIsAuth.isAuth, updateProfile);

//==> get connected brand in influencer detail page POST
router.post('/getconnectedbrand', getConnectedbrand);

// Campaign routes
//==> Create a new campaign POST (requires brand authentication)
// No authentication middleware here, we get brandId directly from the URL params
router.post('/createCampaign/:brandId', createCampaign);


//==> Get brand's own campaigns GET (requires brand authentication)
// The route will now expect a `brandId` parameter in the URL
router.get('/getMyCampaigns/:brandId', getMyCampaigns);

// Route to delete a campaign
router.delete('/deleteCampaign/:brandId/:campaignId', deleteCampaign);

//==> Get all campaigns GET (no authentication needed, public route)
router.get('/getAllCampaigns', getAllCampaigns); 

//==> Apply to a campaign POST (no authentication needed, public route)
router.post('/applyToCampaign', applyToCampaign);

module.exports = router;
