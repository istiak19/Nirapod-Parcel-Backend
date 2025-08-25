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
exports.parcelController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const parcel_service_1 = require("./parcel.service");
const getTrackingParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = req.params.trackingId;
    const parcel = yield parcel_service_1.parcelService.getTrackingParcel(trackingId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel tracking retrieved successfully",
        data: parcel
    });
}));
const getMeParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const { parcel, metaData } = yield parcel_service_1.parcelService.getMeParcel(decodedToken, query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel retrieved successfully",
        data: { parcel },
        meta: metaData
    });
}));
const statusLogParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const statusLogs = yield parcel_service_1.parcelService.statusLogParcel(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel status logs retrieved successfully.",
        data: statusLogs
    });
}));
const createParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const payload = req.body;
    const parcel = yield parcel_service_1.parcelService.createParcel(payload, decodedToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Parcel created successfully",
        data: parcel
    });
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = req.params.id;
    const payload = req.body;
    const parcel = yield parcel_service_1.parcelService.cancelParcel(payload, decodedToken, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel cancel successfully",
        data: parcel
    });
}));
const getMeReceiverParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const { parcel, metaData } = yield parcel_service_1.parcelService.getMeReceiverParcel(decodedToken, query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel retrieved successfully",
        data: { parcel },
        meta: metaData
    });
}));
const incomingParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const parcel = yield parcel_service_1.parcelService.incomingParcels(decodedToken.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Incoming parcels retrieved successfully",
        data: parcel
    });
}));
const confirmDeliveryParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = req.params.id;
    const payload = req.body;
    const parcel = yield parcel_service_1.parcelService.confirmDeliveryParcel(payload, decodedToken, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Delivery confirmed successfully",
        data: parcel
    });
}));
const rescheduleParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = req.params.id;
    const payload = req.body;
    const parcel = yield parcel_service_1.parcelService.rescheduleParcel(payload, decodedToken, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel delivery rescheduled",
        data: parcel
    });
}));
const returnParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = req.params.id;
    const payload = req.body;
    const parcel = yield parcel_service_1.parcelService.returnParcel(payload, decodedToken, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel returned successfully",
        data: parcel
    });
}));
const deliveryHistoryParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const parcel = yield parcel_service_1.parcelService.deliveryHistoryParcel(decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel delivery history retrieved successfully",
        data: parcel
    });
}));
// Admin section
const getAllParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const parcel = yield parcel_service_1.parcelService.getAllParcel(decodedToken, query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcels retrieved successfully",
        data: parcel.parcel,
        meta: {
            total: parcel.metaData.total,
            page: parcel.metaData.page,
            limit: parcel.metaData.limit,
            totalPage: parcel.metaData.totalPage
        }
    });
}));
const statusParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = req.params.id;
    const payload = req.body;
    const parcel = yield parcel_service_1.parcelService.statusParcel(payload, decodedToken, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel status updated successfully",
        data: parcel
    });
}));
const isBlockedParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const id = req.params.id;
    const payload = req.body;
    const parcel = yield parcel_service_1.parcelService.isBlockedParcel(payload, decodedToken, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Parcel block status updated successfully",
        data: parcel
    });
}));
exports.parcelController = {
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
    isBlockedParcel,
    getMeReceiverParcel
};
