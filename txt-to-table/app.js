const fs = require('fs');
const readline = require('readline')
const path = require("path")
const nodemailer = require("nodemailer")
const smtpTransport = require("nodemailer-smtp-transport")

// 这里写你的邮箱如 jason_pang@outlook.com
var user = ''
// 这里写你的邮箱的smtp授权码
var pass = ''
// 这里写你的收件人邮箱
var to =''
// 这里写你的邮件标题
var subject = ''

// 发件人
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'zenmen',
    auth: {
        user: user,
        pass: pass
    }
}))

// 发送邮件
var sendMail = function (recipient, subject, html) {
    transporter.sendMail({
        from: user,
        to: recipient,
        subject: subject,
        html: html
    }, function (error, response) {
        if (error) {
            console.log(error);
        }
        console.log('发送成功')
    });
}

// 加载txt
var filename = path.join(__dirname, './discover_pay_rate.txt');
var rl = readline.createInterface({
    input: fs.createReadStream(filename)
})

// 表头
var ths;
for (let i = 0; i < 30; i++) {
    ths += `<th>${i+1}日</th>`
}
var th = `<tr><th>日期</th><th>分值</th><th>群体</th><th>新增</th>${ths}</tr>`

// 处理txt数据并生成表格
var td;
var tr;
// 逐行读取
rl.on('line', (line) => {
    let row = line.split('\t');
    console.log('读取一行')
    td = ''
    row.forEach((e) => {
        td += `<td style="padding:5px;">${e}</td>`
    })
    if (td !== '<td>undefined</td>') tr += `<tr>${td}</tr>`;
})
// 侦听文件读取完毕
rl.on('close', (e) => {
    console.log('读取完毕')
    writeHTML(tr)
})

//写入文件
async function writeHTML(tr) {
    console.log('开始写入')
    var html = `<html><body><table border="1" style="border-collapse:collapse;">${th}${tr}</table></body></html>`;
    html = html.replace('undefined', '').replace('undefined', '')

    fs.writeFile('./parsedToTable.html', html, (err, data) => {
        if (err) {
            throw err
        } else {
            console.log('写入结束')
        }
    })
    
    // 发送邮件
    if(user && pass && to && subject){
      sendMail(to, subject, html)
    }
}
