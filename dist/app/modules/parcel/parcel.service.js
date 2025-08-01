"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const trackingID_1 = require("../../utils/trackingID");
const parcel_model_1 = require("./parcel.model");
const AppError_1 = require("../../errors/AppError");
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder/QueryBuilder");
const getTrackingParcel = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(user.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId: id }).select("statusLogs");
    if (!parcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found with the provided tracking ID");
    }
    ;
    return parcel;
});
// Sender Section
const getMeParcel = (sender) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(sender.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const parcel = yield parcel_model_1.Parcel.find({ sender: sender.userId })
        .populate("sender", "name email")
        .populate("receiver", "name email phone");
    if (!parcel.length) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "No parcels found for your account.");
    }
    ;
    return parcel;
});
const statusLogParcel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistParcel = yield parcel_model_1.Parcel.findById(id);
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (isExistParcel.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    }
    ;
    const parcel = yield parcel_model_1.Parcel.findById(id).select("statusLogs").populate("statusLogs.updateBy", "name email");
    return parcel;
});
const createParcel = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const trackingId = (0, trackingID_1.generateTrackingId)();
    const parcel = yield parcel_model_1.Parcel.create(Object.assign(Object.assign({}, payload), { trackingId, sender: senderId, statusLogs: [{
                status: (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.status,
                updateBy: senderId,
                updateAt: new Date(),
                location: ((_d = (_c = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.location) || "Unknown",
                note: ((_f = (_e = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.note) || "Parcel has been requested by sender.",
            }] }));
    const user = yield user_model_1.User.findById(parcel.receiver);
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    if (((_g = parcel.receiver) === null || _g === void 0 ? void 0 : _g.toString()) === user._id.toString()) {
        yield user_model_1.User.findByIdAndUpdate(user._id, { $push: { parcelId: parcel._id } }, { runValidators: true, new: true });
    }
    ;
    return parcel;
});
const cancelParcel = (payload, sender, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const isExistUser = yield user_model_1.User.findById(sender.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const isExistParcel = yield parcel_model_1.Parcel.findById(id);
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (isExistParcel.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    }
    ;
    if (!payload.currentStatus) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Current status is required for status update.");
    }
    ;
    if (isExistParcel.currentStatus === "Dispatched" || isExistParcel.currentStatus === "In Transit" || isExistParcel.currentStatus === "Delivered") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `Parcel cannot be canceled as it is already ${isExistParcel.currentStatus.toLowerCase()}.`);
    }
    ;
    const updatedInfo = {
        currentStatus: payload.currentStatus,
        $push: {
            statusLogs: {
                status: (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.status,
                updateBy: sender.userId,
                updateAt: new Date(),
                location: ((_d = (_c = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.location) || "Sender App",
                note: ((_f = (_e = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.note) || "Parcel has been cancelled by sender."
            }
        }
    };
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });
    return parcel;
});
// Receiver section
const incomingParcels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(id);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const parcels = yield parcel_model_1.Parcel.find({
        receiver: id,
        currentStatus: { $nin: ["Delivered", "Returned", "Cancelled"] }
    })
        .populate("sender", "name email phone")
        .populate("receiver", "name email");
    if (!parcels.length) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "No incoming parcel found");
    }
    ;
    return parcels;
});
const confirmDeliveryParcel = (payload, receiver, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const isExistUser = yield user_model_1.User.findById(receiver.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const isExistParcel = yield parcel_model_1.Parcel.findById(id);
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (isExistParcel.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    }
    ;
    if (!payload.currentStatus) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Current status is required for status update.");
    }
    ;
    if (isExistParcel.currentStatus !== "In Transit") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `Parcel can only be marked as 'Delivered' if it is currently 'In Transit'. Current status is '${isExistParcel.currentStatus}'.`);
    }
    ;
    const updatedInfo = {
        currentStatus: payload.currentStatus,
        $push: {
            statusLogs: {
                status: (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.status,
                updateBy: receiver.userId,
                updateAt: new Date(),
                location: ((_d = (_c = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.location) || "Delivery Address",
                note: (_f = (_e = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.note
            }
        }
    };
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });
    return parcel;
});
const rescheduleParcel = (payload, receiver, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const isExistUser = yield user_model_1.User.findById(receiver.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const isExistParcel = yield parcel_model_1.Parcel.findById(id);
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (isExistParcel.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    }
    ;
    if (!((_b = (_a = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.status)) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Current status is required for status update.");
    }
    ;
    if (isExistParcel.currentStatus !== "In Transit") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `Parcel can only be marked as 'Delivered' if it is currently 'In Transit'. Current status is '${isExistParcel.currentStatus}'.`);
    }
    ;
    const updatedInfo = {
        deliveryDate: payload.newDate,
        $push: {
            statusLogs: {
                status: (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.status,
                updateBy: receiver.userId,
                updateAt: new Date(),
                location: ((_f = (_e = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.location) || "Delivery Address",
                note: `Parcel delivery rescheduled to ${payload.newDate}`
            }
        }
    };
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });
    return parcel;
});
const returnParcel = (payload, receiver, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(receiver.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const isExistParcel = yield parcel_model_1.Parcel.findById(id);
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (isExistParcel.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "This parcel is blocked and cannot be accessed.");
    }
    ;
    if (isExistParcel.currentStatus === "Delivered") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Delivered parcel can't be returned");
    }
    if (!payload.currentStatus) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Current status is required for status update.");
    }
    ;
    if (isExistParcel.currentStatus !== "In Transit") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `Parcel can only be marked as 'Delivered' if it is currently 'In Transit'. Current status is '${isExistParcel.currentStatus}'.`);
    }
    ;
    const updatedInfo = {
        currentStatus: payload.currentStatus,
        $push: {
            statusLogs: {
                status: "Returned",
                updateBy: receiver.userId,
                updateAt: new Date(),
                location: "N/A",
                note: "Parcel has been returned by receiver"
            }
        }
    };
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });
    return parcel;
});
const deliveryHistoryParcel = (receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(receiver.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const isExistParcel = yield parcel_model_1.Parcel.find({ currentStatus: "Delivered", receiver: receiver.userId });
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (!isExistParcel.length) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "You have no delivered parcels yet.");
    }
    ;
    return isExistParcel;
});
// Admin Section
const getAllParcel = (token, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(token.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const searchFields = ["currentStatus"];
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), query);
    const parcel = yield queryBuilder
        .search(searchFields)
        .modelQuery
        .populate("sender", "name email")
        .populate("receiver", "name email");
    const totalParcel = yield parcel_model_1.Parcel.countDocuments();
    return {
        parcel,
        totalParcel
    };
});
const statusParcel = (payload, admin, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const isExistUser = yield user_model_1.User.findById(admin.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const isExistParcel = yield parcel_model_1.Parcel.findById(id);
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (!payload.currentStatus) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Current status is required for status update.");
    }
    ;
    if (isExistParcel.currentStatus === "Delivered") {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Cannot change status. Parcel is already delivered.");
    }
    ;
    const updatedInfo = {
        currentStatus: payload.currentStatus,
        $push: {
            statusLogs: {
                status: (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.status,
                updateBy: admin.userId,
                updateAt: new Date(),
                location: ((_d = (_c = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.location) || "Admin Office",
                note: (_f = (_e = payload === null || payload === void 0 ? void 0 : payload.statusLogs) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.note
            }
        }
    };
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, updatedInfo, {
        runValidators: true,
        new: true
    });
    return parcel;
});
const isBlockedParcel = (payload, admin, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(admin.userId);
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    ;
    const isExistParcel = yield parcel_model_1.Parcel.findById(id);
    if (!isExistParcel) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parcel not found");
    }
    ;
    if (typeof payload.isBlocked !== "boolean") {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "isBlocked field is required and must be a boolean");
    }
    ;
    if (payload.isBlocked === isExistParcel.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Parcel is already ${isExistParcel.isBlocked ? "blocked" : "unblocked"}.`);
    }
    ;
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, { isBlocked: payload.isBlocked }, {
        runValidators: true,
        new: true
    });
    return parcel;
});
exports.parcelService = {
    getTrackingParcel,
    getMeParcel,
    statusLogParcel,
    createParcel,
    cancelParcel,
    incomingParcels,
    confirmDeliveryParcel,
    rescheduleParcel,
    returnParcel,
    deliveryHistoryParcel,
    getAllParcel,
    statusParcel,
    isBlockedParcel
};
