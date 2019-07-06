const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: [true,'User with this email already exists'],
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid');
			}
		}
	},
	password: {
		type: String,
		required: true,
		minlength: [7, 'password should be greater than six characters'],
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('Password cannot conatin word "password"');
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error('Age cannot be negative');
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
});

userSchema.methods.toJSON = function(){
	const user = this.toObject();
	delete user.tokens;	
	delete user.password;
	return user;
}

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id.toString() }, 'ThisIsASignatureString');
	user.tokens.push({ token })
	await user.save();
	return token;
}

userSchema.statics.findByCredentials = async (email, password) => {

	const user = await User.findOne({ email })
	if (!user)
		throw new Error('Unable to login');

	const isCorrectPwd = await bcrypt.compare(password, user.password);
	if (!isCorrectPwd)
		throw new Error('Unable to login');

	return user;
}

userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;