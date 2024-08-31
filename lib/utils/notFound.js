"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    return res.status(404).json({ message: "Router Path does not exists" });
};
exports.default = notFound;
