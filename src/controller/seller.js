const sellerModel = require("../models/seller");
const createError = require("http-errors");
const commonHelper = require("../helper/common");

const { authenticateGoogle, uploadToGoogleDrive, deleteFromGoogleDrive } = require("../middlewares/googleDriveService");
const sellerController = {
  getPaginationSeller: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        querysearch = ` where name_store like '%${search.toLowerCase()}%' `;
      }
      const sortby = req.query.sortby || "created_on";
      const sort = req.query.sort || "asc";
      const result = await sellerModel.selectPagination({ limit, offset, sortby, sort, querysearch });
      const totalData = parseInt(result.rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },
  getSeller: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await sellerModel.selectSellerId(id);

      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },

  // insertSeller: async (req, res) => {
  //   const queryCreate = req.query.create;
  //   try {
  //     if (typeof (queryCreate) == 'undefined') throw ("Error Seller Create Url")
  //     try {
  //       const email = req.payload.email
  //       const { rows: [user] } = await sellerModel.findEmail(email)
  //       delete user.password
  //       const id = user.id
  //       const users_id = user.id

  //       const checkSellerId = await sellerModel.selectSellerId(id)

  //       try {
  //         if (checkSellerId.rowCount == 1) throw 'Seller Has Ben Created';
  //       } catch (error) {
  //         return (commonHelper.response(res, null, 403, error))
  //       }

  //       const PORT = process.env.PORT
  //       const DB_HOST = process.env.DB_HOST
  //       const filelogo = req.file.filename;
  //       const logo = `http://${DB_HOST}:${PORT}/upload/${filelogo}`

  //       const {
  //         name_store,
  //         address,
  //         description
  //       } = req.body;
  //       await sellerModel.insertSeller(
  //         id,
  //         users_id,
  //         name_store,
  //         logo,
  //         address,
  //         description
  //       )
  //       commonHelper.response(res, null, 201, "New Seller Created");
  //     } catch (error) {
  //       res.send(createError(400));
  //     }
  //   } catch (err) {
  //     res.send(createError(404, err));
  //   }
  // },

  // updateSeller: async (req, res) => {
  //   const queryUpdate = req.query.update;
  //   try {
  //     if (typeof (queryUpdate) == 'undefined') throw ("Error Seller Update Url")
  //     try {
  //       const email = req.payload.email
  //       const { rows: [user] } = await sellerModel.findEmail(email)
  //       delete user.password
  //       const id = user.id

  //       const checkSellerId = await sellerModel.selectSellerId(id)

  //       try {
  //         if (checkSellerId.rowCount == 0) throw 'Seller has not found';
  //       } catch (error) {
  //         return (commonHelper.response(res, null, 404, error))
  //       }

  //       const PORT = process.env.PORT
  //       const DB_HOST = process.env.DB_HOST
  //       const filelogo = req.file.filename;
  //       const logo = `http://${DB_HOST}:${PORT}/upload/${filelogo}`

  //       const {
  //         name_store,
  //         address,
  //         description
  //       } = req.body;
  //       await sellerModel.updateSeller(
  //         id,
  //         name_store,
  //         logo,
  //         address,
  //         description
  //       )
  //       commonHelper.response(res, null, 201, "Seller Updated");
  //     } catch (error) {
  //       res.send(createError(400));
  //     }
  //   } catch (err) {
  //     res.send(createError(404, err));
  //   }
  // },

  // deleteSeller: async (req, res) => {
  //   const queryDelete = req.query.delete;
  //   // console.log(req.method == 'DELETE');
  //   try {
  //     if (typeof (queryDelete) == 'undefined') throw ("Error Seller Delete Url")
  //     try {
  //       const email = req.payload.email
  //       const { rows: [user] } = await sellerModel.findEmail(email)
  //       delete user.password
  //       const id = user.id

  //       const checkSellerId = await sellerModel.selectSellerId(id)

  //       try {
  //         if (checkSellerId.rowCount == 0) throw 'Seller has not found';
  //       } catch (error) {
  //         return (commonHelper.response(res, null, 404, error))
  //       }

  //       await sellerModel.deleteSeller(id)
  //       commonHelper.response(res, null, 200, "Seller Deleted");
  //     } catch (error) {
  //       res.send(createError(404));
  //     }
  //   } catch (err) {
  //     res.send(createError(404, err));
  //   }
  // },

  insertSeller: async (req, res) => {
    const queryCreate = req.query.create;
    try {
      if (typeof queryCreate == "undefined") throw "Error Seller Create Url";
      try {
        const email = req.payload.email;
        const {
          rows: [user],
        } = await sellerModel.findEmail(email);
        delete user.password;
        const id = user.id;
        const users_id = user.id;

        const checkSellerId = await sellerModel.selectSellerId(id);

        try {
          if (checkSellerId.rowCount == 1) throw "Seller Has Ben Created";
        } catch (error) {
          return commonHelper.response(res, null, 403, error);
        }

        // const PORT = process.env.PORT
        // const DB_HOST = process.env.DB_HOST
        // const filelogo = req.file.filename;
        let logo = ``;
        if (!req.file) {
          // logo = `http://${DB_HOST}:${PORT}/upload/default.png`
          logo = `https://drive.google.com/thumbnail?id=1xVjzZRWh4Ck1NpBo9GARV9uCz-TVX42K&sz=s1080`;
        } else {
          const auth = authenticateGoogle();

          // if (user.picture != null || user.picture != undefined) {
          //   await deleteFromGoogleDrive(user.picture, auth);
          // }

          // Upload to Drive
          const response = await uploadToGoogleDrive(req.file, auth);
          logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;
        }

        const { name_store, address, description } = req.body;
        await sellerModel.insertSeller(id, users_id, name_store, logo, address, description);
        commonHelper.response(res, null, 201, "New Seller Created");
      } catch (error) {
        res.send(createError(400));
      }
    } catch (err) {
      res.send(createError(404, err));
    }
  },

  updateSeller: async (req, res) => {
    try {
      const id = req.params.id;
      const checkSellerId = await sellerModel.selectSellerId(id);
      try {
        if (checkSellerId.rowCount == 0) throw "Seller has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }
      // const PORT = process.env.PORT;
      // const DB_HOST = process.env.DB_HOST;
      if (!req.file) {
        const { name_store, address, phone, description } = req.body;
        await sellerModel.updateSellerNoLogo(id, name_store, address, phone, description);
      } else {
        // const filelogo = req.file.filename;
        // const logo = `http://${DB_HOST}:${PORT}/upload/${filelogo}`;
        let logo = ``;

        const auth = authenticateGoogle();

        if (checkSellerId.rows[0].logo != null || checkSellerId.rows[0].logo != undefined) {
          await deleteFromGoogleDrive(checkSellerId.rows[0].logo, auth);
        }

        // Upload to Drive
        const response = await uploadToGoogleDrive(req.file, auth);
        logo = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=s1080`;

        const { name_store, address, phone, description } = req.body;
        await sellerModel.updateSeller(id, name_store, logo, address, phone, description);
      }
      commonHelper.response(res, null, 201, "Seller Updated");
    } catch (err) {
      res.send(createError(404, err));
    }
    // !req.file ? console.log('Missing mandatory file') : console.log('file ada')
  },

  deleteSeller: async (req, res) => {
    try {
      const id = req.params.id;
      const checkSellerId = await sellerModel.selectSellerId(id);
      try {
        if (checkSellerId.rowCount == 0) throw "Seller has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await sellerModel.deleteSeller(id);
      commonHelper.response(res, null, 200, "Seller Deleted");
    } catch (err) {
      res.send(createError(404, err));
    }
  },

  insertSellerOnRegister: async (req, res) => {
    try {
      const { email, name_store, phone } = req.body;

      const {
        rows: [user],
      } = await sellerModel.findEmail(email);
      delete user.password;
      const id = user.id;
      const users_id = user.id;

      const PORT = process.env.PORT;
      const DB_HOST = process.env.DB_HOST;
      const logo = `http://${DB_HOST}:${PORT}/upload/default.png`;

      await sellerModel.insertSellerOnRegister(id, users_id, name_store, logo, phone);
      commonHelper.response(res, null, 201, "New Seller Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
};

module.exports = sellerController;
