import { generateTrackingId } from "../../utils/trackingID";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const createParcel = async (payload: Partial<IParcel>, senderId: string) => {
    const trackingId = generateTrackingId();
    const parcel = await Parcel.create({
        ...payload,
        trackingId,
        sender: senderId,
        statusLogs: [{
            status:  payload?.statusLogs?.[0]?.status,
            updateBy: senderId,
            updateAt: new Date(),
            note:  payload?.statusLogs?.[0]?.note || "Parcel has been requested by sender.",
        }],
    });
    return parcel;
};

export const parcelService = {
    createParcel
};