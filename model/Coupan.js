import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CoupanSchema = new Schema(
    {
        code: {
            type: String,
            required: true,    
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            default: 0
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

//coupan is expired
CoupanSchema.virtual("isExpired").get(function(){
    return this.endDate < Date.now();
});

CoupanSchema.virtual("daysLeft").get(function(){
    const daysLeft = Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) + ' Days Left';
    //1000 represent 1 millisecond
    return daysLeft;
});

//validation
CoupanSchema.pre("validate", function(next) {
    if(this.endDate < this.startDate) {
        next(new Error("End date cannot be less than start date!"));
    }
    next();
});

CoupanSchema.pre("validate", function(next) {
    if(this.startDate < Date.now()) {
        next(new Error("Start date cannot be less than today date!"));
    }
    next();
});

CoupanSchema.pre("validate", function(next) {
    if(this.endDate < Date.now()) {
        next(new Error("End date cannot be less than today date!"));
    }
    next();
});

CoupanSchema.pre("validate", function(next) {
    if(this.discount <= 0 || this.discount > 100){
        next(new Error("Discount cannot be less than 0 or greater than 100."));
    }
    next();
});



const Coupan = mongoose.model("Coupan", CoupanSchema);
export default Coupan;  