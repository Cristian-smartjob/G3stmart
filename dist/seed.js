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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var axios_1 = require("axios");
var prisma = new client_1.PrismaClient();
function fetchYearData(tipo, year) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("https://mindicador.cl/api/".concat(tipo, "/").concat(year))];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data.serie];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var startYear, endYear, allData, year, ufSerie, usdSerie, _i, _a, _b, date, values;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    startYear = 2024;
                    endYear = new Date().getFullYear();
                    allData = {};
                    year = startYear;
                    _c.label = 1;
                case 1:
                    if (!(year <= endYear)) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchYearData("uf", year)];
                case 2:
                    ufSerie = _c.sent();
                    return [4 /*yield*/, fetchYearData("dolar", year)];
                case 3:
                    usdSerie = _c.sent();
                    ufSerie.forEach(function (item) {
                        var date = item.fecha.substring(0, 10);
                        if (!allData[date])
                            allData[date] = {};
                        allData[date].uf = item.valor;
                    });
                    usdSerie.forEach(function (item) {
                        var date = item.fecha.substring(0, 10);
                        if (!allData[date])
                            allData[date] = {};
                        allData[date].usd = item.valor;
                    });
                    _c.label = 4;
                case 4:
                    year++;
                    return [3 /*break*/, 1];
                case 5:
                    _i = 0, _a = Object.entries(allData);
                    _c.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    _b = _a[_i], date = _b[0], values = _b[1];
                    if (!(values.uf !== undefined && values.usd !== undefined)) return [3 /*break*/, 8];
                    return [4 /*yield*/, prisma.currencyHistory.upsert({
                            where: { date: new Date(date) },
                            update: { uf: values.uf, usd: values.usd },
                            create: {
                                date: new Date(date),
                                uf: values.uf,
                                usd: values.usd,
                            },
                        })];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
