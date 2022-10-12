
const { errorMessageFormatter } = require('../utils/helpers')
const { getUserByEmail } = require('../controller/user.controller')
const { AllowedUsersForModification, Roles, AllowedSaleRole, UserRegisterType } = require('../utils/constants')
const jwt_decode = require('jwt-decode');

const Auth_Rqeuired = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    if(!authHeader) return res.status(401).json({ error: 'Authentication Required.' })

    const token = authHeader.split('Bearer ')[1]
    

   var decoder = jwt_decode(token);
    // console.log('auth theke',users)
    // const { uid, email, role, shop } = await getAuth().verifyIdToken(token)

    // console.log(email)
    // if(!uid) return res.status(401).json({ error: 'Unauthorized User' })
    
    // const user = await getUserByEmail(email)

    // if(UserRegisterType.has(user.role) && !user.approved) return res.status(401).json({ error: 'User is not approved by the admin.' })
    
    // req.user = { uid, email, _id: user?._id }

    // if(role) req.user.role = role
    // if(shop) req.user.shop = shop

    if(token ==null) return res.status(401).json({ error: 'Unauthorized User' })
    
    next()
  } catch (err) {
    const errorMessage = errorMessageFormatter(err)
    return res.status(500).json(errorMessage)
  }
}

const Can_User_Modify = (req, res, next) => {
  if(!AllowedUsersForModification.has(req.user.role)) return res.status(401).json({ error: 'User request can not be fullfilled.'})
  next()
}

const Only_Admin = (req, res, next) => {
  if(req.user.role !== Roles.ADMIN) return res.status(401).json({ error: 'User request can not be fullfilled.'})
  next()
}

const Only_Retailer_And_Wholeseller = (req, res, next) => {
  if(req.user.role !== Roles.RETAILER || req.user.role !== Roles.WHOLESELLER) return res.status(401).json({ error: 'User request can not be fullfilled.'})
  next()
}

const Can_User_Sale = (req, res, next) => {
  if(!AllowedSaleRole.has(req.user.role)) return res.status(401).json({ error: 'User request can not be fullfilled.'})
  next()
}


module.exports = {
  Auth_Rqeuired,
  Can_User_Modify,
  Only_Admin,
  Only_Retailer_And_Wholeseller,
  Can_User_Sale
}