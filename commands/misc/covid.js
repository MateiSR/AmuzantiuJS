const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
const embeds = require("../../utils/embeds.js");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Bucharest");

async function getContent(date) {
    let formattedDate = date.format("DDMMYYYY");
    var month = (date.month() + 1).toString();
    if (date.month() + 1 < 10) {
        month = "0" + month;
    }
    let year = date.year();
    let src = `https://is.prefectura.mai.gov.ro/wp-content/uploads/sites/49/${year}/${month}/RI1K14_${formattedDate}.pdf`;
    const doc = await pdfjs.getDocument(src).promise; // note the use of the property promise
    const page = await doc.getPage(1);
    return await page.getTextContent();
}

async function getData(date) {
    let formattedDate = date.format("DDMMYYYY");
    var month = (date.month() + 1).toString();
    if (date.month() + 1 < 10) {
        month = "0" + month;
    }
    let year = date.year();
    let src = `https://is.prefectura.mai.gov.ro/wp-content/uploads/sites/49/${year}/${month}/RI1K14_${formattedDate}.pdf`;
    try {
        var content = await getContent(date);
    } catch (error) {
        return await getData(date.subtract(1, "day"));
    }

    let data = content.items.map((item) => item.str);
    let dataEntries = Object.entries(data);
    for (entry of dataEntries) {
        if (entry.includes("MUNICIPIUL IASI")) nameIndex = parseInt(entry[0]);
    }
    let city = data[nameIndex];
    let incidence = data[nameIndex + 2];
    return [date.format("DD/MM/YYYY"), city, incidence, src];
}

module.exports = {
    name: "covid",
    aliases: ["incidenta"],
    description: "incidenta covid",
    async execute(message, args) {
        let date = dayjs();
        await getData(date).then(function(ret) {
            message.channel.send({
                embeds: [embeds.replyEmbed(`\`${ret[2]}\` - Rata de incidență in  \`${ret[1]}\`\nActualizat la data de: \`${ret[0]}\``)
                    .setTitle("Click pentru lista completa")
                    .setURL(ret[3])
                ]
            });
        });
    }
}