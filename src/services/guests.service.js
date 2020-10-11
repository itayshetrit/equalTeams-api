const uuid = require('uuid');
import axios from 'axios'
import accountModel from '../models/user'
import guestModel from '../models/guest'
// return uuid();
import { responseWrapper, responseSuccess } from '../common/respone';

const getJwtAndIdToken = (uid, id_token) => {
	const token = signJwtWithExp({ uid: uid }, '30d');
	console.log('User access token created');
	return ({ jwt: token, id_token: id_token })
}

// export const whatsapp = async () => {
//     const client = new WhatsAppWeb()
//     const whatsapp = () => {
//         client.connect()
//             .then(([user, chats, contacts, unread]) => {
//                 console.log("oh hello " + user.name + " (" + user.id + ")")
//                 console.log("you have " + unread.length + " unread messages")
//                 console.log("you have " + chats.length + " chats")
//             })
//             .catch(err => console.log("unexpected error: " + err))
//     }
// }
export const addGuest = async (req) => {
	try {
		const guest = new guestModel({ ...req.body })
		await guest.save()
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const deleteGuest = async (id) => {
	console.log(id);
	console.log('delete guest service');
	try {
		const guest = await guestModel.findByIdAndDelete(id)
		return responseSuccess({ ok: 1 });
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const setAccept = async (id, accept) => {

	console.log('edit guest service');
	try {
		const guest = await guestModel.updateOne({ _id: id }, { accept })
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const editGuest = async (id, body) => {

	console.log('edit guest service');
	try {
		const guest = await guestModel.updateOne({ _id: id }, { ...body })
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const setGuestTable = async (id, table) => {
	console.log('set guest table service');
	try {
		const guest = await guestModel.updateOne({ _id: id }, { $set: { table } })
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const getGuests = async (uid) => {
	console.log('get guests service');
	try {
		const guests = await guestModel.find({ uid }).sort({ closeness: 1 })
		return responseSuccess(guests)
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const getTablesGuests = async (uid) => {
	console.log('get guests service');
	try {
		const guests = await guestModel.find({ uid, table: { $ne: null } }).sort({ table: 1 })
		return responseSuccess(guests)
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}