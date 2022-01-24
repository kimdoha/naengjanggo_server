//const request = require('request');
const { pool } = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const wasteProvider = require("./wasteProvider");
const wasteService = require("./wasteService");
const wasteDao = require("./wasteDao");
const userProvider = require("../User/userProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { connect } = require("http2");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");
const { start } = require('repl');


/**
 * API No. 50
 * API Name : 음식물쓰레기 배출량 간편 조회 API
 * [GET] /user/food-waste/month/:month
 * 
 */

 exports.SelectWaste = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const month = req.params.month;

     // 공백 체크
    var re = /^ss*$/;

    if(!month || re.test(month))
      return res.send(errResponse(baseResponse.INPUT_MONTH));

    if(!Number(month))
      return res.send(errResponse(baseResponse.INPUT_NUMBER));

    if(month < 1 || month > 12)
      return res.send(errResponse(baseResponse.MONTH_RANGE ));

    // 아이디랑 비번 체크 
    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

  
    const wasteInfo = await wasteProvider.existUserWasteInfo(userId);
    if(wasteInfo.length < 1)
      return res.send(errResponse(baseResponse.NO_EXIST_WASTE));

    const id = wasteInfo[0].homepageID;
    const password = wasteInfo[0].homepagePW;
    const tagnum = wasteInfo[0].tagNum;
    const dong = wasteInfo[0].dong;
    const ho = wasteInfo[0].ho;

    const date = await wasteProvider.retrieveDate(month);
    if(date.length < 1)
      return res.send(errResponse(baseResponse.SERVER_ERROR));

    const startdate = date[0].start;
    const enddate = date[0].end;

    // var puppeteer = require('puppeteer');
     const puppeteer = require('puppeteer-extra');
     // require AWS plugin
     const awsPlugin = require('puppeteer-extra-plugin-aws');
     // add AWS plugin
     puppeteer.use(awsPlugin());

    (async () => {
      try {
        // const browser = await puppeteer.launch({
        //   headless : true
        // });

          const browser = await puppeteer.launch({
              executablePath: '/usr/bin/chromium-browser',
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
          });

        const page = await browser.newPage();

        // Configure the navigation timeout
        await page.setDefaultNavigationTimeout(0);

        //페이지로 가라
        await page.goto('https://www.citywaste.or.kr/ucwmsNew/member/memberLogin.do');

        //아이디랑 비밀번호 란에 값을 넣어라 
        await page.evaluate((id, password) => {
          document.querySelector('input[name="userid"]').value = id;
          document.querySelector('input[name="userpwd"]').value = password;
        }, id, password);


        //로그인 버튼을 클릭해라
        await page.click('button[id="btn_login"]');
        //로그인 화면이 전환될 때까지 .5초만 기다려라
        await page.waitForTimeout(500);


        // //음쓰 페이지로 가서
        await page.goto('https://www.citywaste.or.kr/portal/status/selectSimpleEmissionQuantity.do');
        
        let temp2 = await page.$eval("#subMenu4", (data) => data.href);
        // console.log(temp2);
        if(temp2.includes("javascript") && temp2.includes("alert"))
          return res.send(errResponse(baseResponse.NO_ACCESS_LOGIN));
        
        await page.goto('https://www.citywaste.or.kr/portal/status/selectSimpleEmissionQuantity.do');
        // console.log("login-Success");

        //아이디랑 비밀번호 란에 값을 넣어라
        await page.evaluate((tagnum, dong, ho, startdate, enddate) => {
          document.querySelector('input[id="tagprintcd"]').value = tagnum;
          document.querySelector('input[id="aptdong"]').value = dong;
          document.querySelector('input[id="apthono"]').value = ho;
          document.querySelector('input[id="startchdate"]').value = startdate;
          document.querySelector('input[id="endchdate"]').value = enddate;
          
        }, tagnum, dong, ho, startdate, enddate);

        //간편조회 버튼을 클릭해라
        await page.click('button[class="btn btn-darker"]');
        
        //화면이 전환될 때까지 .5초만 기다려라
        await page.waitForTimeout(500);
        // console.log("간편조회 Success");


        async function getAll(page) {
          let data = [];
      
          const number = await page.$$eval("#dataList > tr", (data) => data.length);
          // tr태그의 개수를 세어서 줄의 개수를 얻은 후에
          for (let index = 0; index < number; index++) {
              data.push(await getOne(page, index + 1));
              // 각 줄의 정보를 얻어서 배열에 Push
          }
      
          return Promise.resolve(data);
        }
        
        async function getOne(page, index) {
        
          let data = {};
    
          let temp = await page.$eval("#dataList > tr:nth-child(" + index + ") > td:nth-child(1)", (data) => data.textContent);
          
          if(temp === "조회된 데이터가 없습니다."){
            return res.send(errResponse(baseResponse.NO_SEARCH_DATA));
          } else {

            data.month = temp;
            data.date = await page.$eval("#dataList > tr:nth-child(" + index + ") > td:nth-child(2)", (data) => data.textContent);
            data.emissions = await page.$eval("#dataList > tr:nth-child(" + index + ") > td:nth-child(3)", (data) => data.textContent);
            return Promise.resolve(data);
          }

        }
        let totalData = await getAll(page);

        //브라우저 꺼라
        await browser.close(); 

        if(totalData.length > 1){
          return res.json({ isSuccess:true, code:1000, message:"음식물쓰레기 배출량 간편조회 완료!", "diff" : Number((totalData[0].emissions - totalData[1].emissions).toFixed(1)), "result": totalData });
        } else {
          return res.json({ isSuccess:true, code:1000, message:"음식물쓰레기 배출량 간편조회 완료!", "result": totalData });
        }
        

      } catch (error) {
        console.log(error);
      }

  })();

};

/**
 * API No. 51
 * API Name : 음식물쓰레기 수수료 간편 조회 API
 * [GET] /user/food-price
 * 
 */

 exports.SelectPrice = async function (req, res) {
  const userId = req.verifiedToken.userId; // 내 아이디
  // const { id, password } = req.body;
  // const { month } = req.params;

  // 아이디랑 비번 체크 
  // 유저 체크
  const statusCheck = await userProvider.checkUserStatus(userId);
  if(statusCheck.length < 1)
    return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
  // console.log(statusCheck);
  const nickname = statusCheck[0].nickName + '님';
  const profileImg = statusCheck[0].profileImg;

  const wasteInfo = await wasteProvider.existUserWasteInfo(userId);
  if(wasteInfo.length < 1)
    return res.send(errResponse(baseResponse.NO_EXIST_WASTE));

    const id = wasteInfo[0].homepageID;
    const password = wasteInfo[0].homepagePW;

     const puppeteer = require('puppeteer-extra');
     // require AWS plugin
     const awsPlugin = require('puppeteer-extra-plugin-aws');
     // add AWS plugin
     puppeteer.use(awsPlugin());

    (async () => {
      try {
        // const browser = await puppeteer.launch({
        //   headless : true
        // });


          const browser = await puppeteer.launch({
              executablePath: '/usr/bin/chromium-browser',
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
          });

        const page = await browser.newPage();

        // Configure the navigation timeout
        await page.setDefaultNavigationTimeout(0);

        //페이지로 가라
        await page.goto('https://www.citywaste.or.kr/ucwmsNew/member/memberLogin.do');

        //아이디랑 비밀번호 란에 값을 넣어라 
        await page.evaluate((id, password) => {
          document.querySelector('input[name="userid"]').value = id;
          document.querySelector('input[name="userpwd"]').value = password;
        }, id, password);


        //로그인 버튼을 클릭해라
        await page.click('button[id="btn_login"]');
        //로그인 화면이 전환될 때까지 .5초만 기다려라
        await page.waitForTimeout(500);


        // //음쓰 페이지로 가서
        await page.goto('https://www.citywaste.or.kr/portal/status/selectSimpleEmissionQuantity.do');
        
        let temp2 = await page.$eval("#subMenu4", (data) => data.href);
        console.log(temp2);
        if(temp2.includes("javascript") && temp2.includes("alert"))
          return res.send(errResponse(baseResponse.NO_ACCESS_LOGIN));
        
        await page.goto('https://www.citywaste.or.kr/portal/status/selectMyEmissionCharge.do');
        
        //로그인 버튼을 클릭해라
        await page.click('#real_contents > div > div > section > div > div:nth-child(3) > h4 > a');
        //로그인 화면이 전환될 때까지 .5초만 기다려라
        await page.waitForTimeout(500);
        console.log("login-Success");

 
          async function getAll(page) {
            let data = [];
            
            const number = await page.$$eval("#dataList2 > tr", (data) => data.length);
            // tr태그의 개수를 세어서 줄의 개수를 얻은 후에
            for (let index = 0; index < number; index++) {
              if(index == number - 1)
                data.push(await getLastOne(page, index + 1));
              else
                data.push(await getOne(page, index + 1));
                // 각 줄의 정보를 얻어서 배열에 Push
            }
            
        
            return Promise.resolve(data);
        }
        
        async function getOne(page, index) {
        
            let data = {};
            
            var temp1 = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(1)", (data) => data.textContent);
            temp1 = temp1.replace(/\n/g,'');
            temp1 = temp1.replace(/\t/g,'');
            data.month = temp1;
            
            var temp2  = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(2)", (data) => data.textContent);
            temp2 = temp2.replace(/\n/g,'');
            temp2 = temp2.replace(/\t/g,'');
            data.emissions = temp2 + "kg";

            var temp3 = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(6)", (data) => data.textContent);
            temp3 = temp3.replace(/\n/g,'');
            temp3 = temp3.replace(/\t/g,'');
            data.unsettled = temp3 + "원";

            var temp4 = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(7)", (data) => data.textContent);
            temp4 = temp4.replace(/\n/g,'');
            temp4 = temp4.replace(/\t/g,'');
            data.price = temp4 + "원";

            return Promise.resolve(data);

        }

        async function getLastOne(page, index) {
        
          let data = {};
          
          // data.totalMonth = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(1)", (data) => data.textContent);
          data.totalEmissions = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(2)", (data) => data.textContent + "kg");
          // data.totalUnsettled = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(6)", (data) => data.textContent + "원");
          data.totalPrice = await page.$eval("#dataList2 > tr:nth-child(" + index + ") > td:nth-child(7)", (data) => data.textContent + "원");
          
          return Promise.resolve(data);

      }
        let totalData = await getAll(page);

        //브라우저 꺼라
        await browser.close(); 
        return res.json({ isSuccess:true, code:1000, message:"음식물쓰레기 수수료 간편조회 완료!", "nickname" : nickname, "profileImg" : profileImg ,"result" : totalData[totalData.length-1] });

      } catch (error) {
        console.log(error);
      }

})();

};


/**
 * API No. 52.
 * API Name : RFID 음식물 쓰레기 사용자 정보 저장 API
 * [POST] /user/food-waste/info-setting
 * 
 */

 exports.saveWasteInfo = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const { id, password, tagnum, dong, ho } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkUserStatus(userId);
    if(statusCheck.length < 1)
      return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;

    // 공백체크
    if(!id || re.test(id))
      return res.send(errResponse(baseResponse.NO_WASTE_ID ));

    if(!password || re.test(password))
      return res.send(errResponse(baseResponse.NO_WASTE_PW ));

    if(!tagnum || re.test(tagnum))
      return res.send(errResponse(baseResponse.NO_WASTE_TAGNUM));

    if(!dong || re.test(dong))
      return res.send(errResponse(baseResponse.NO_WASTE_DONG));

    if(!ho || re.test(ho))
      return res.send(errResponse(baseResponse.NO_WASTE_HO));
      
    if(!String(id) ||  !String(password) || !String(tagnum) 
    || !String(dong) || !String(ho))
      return res.send(errResponse(baseResponse.NO_WASTE_STRING));

    // 태그 인쇄번호 
    var reTag = /^KKRW+[a-zA-Z0-9]{13}$/;
    if(!reTag.test(tagnum))
      return res.send(errResponse(baseResponse.INVALID_TAGNUM));


     const puppeteer = require('puppeteer-extra');
     // require AWS plugin
     const awsPlugin = require('puppeteer-extra-plugin-aws');
     // add AWS plugin
     puppeteer.use(awsPlugin());

    // 유저 정보 저장 및 수정
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const existUserWasteInfo = await wasteDao.existUserWasteInfo(connection, userId);
        if(existUserWasteInfo.length < 1){

          (async () => {
            try {

              const browser = await puppeteer.launch({
                  executablePath: '/usr/bin/chromium-browser',
                  headless: true,
                  args: ['--no-sandbox', '--disable-setuid-sandbox']
              });


              const page = await browser.newPage();
      
              // Configure the navigation timeout
              await page.setDefaultNavigationTimeout(0);
      
              //페이지로 가라
              await page.goto('https://www.citywaste.or.kr/ucwmsNew/member/memberLogin.do');
      
              //아이디랑 비밀번호 란에 값을 넣어라 
              await page.evaluate((id, password) => {
                document.querySelector('input[name="userid"]').value = id;
                document.querySelector('input[name="userpwd"]').value = password;
              }, id, password);
      
      
              //로그인 버튼을 클릭해라
              await page.click('button[id="btn_login"]');
              //로그인 화면이 전환될 때까지 .5초만 기다려라
              await page.waitForTimeout(500);
      
      
              // //음쓰 페이지로 가서
              await page.goto('https://www.citywaste.or.kr/portal/status/selectSimpleEmissionQuantity.do');
              
              // 로그인 실패
              let temp2 = await page.$eval("#subMenu4", (data) => data.href);
              console.log(temp2);
              if(temp2.includes("javascript") && temp2.includes("alert")){
                await browser.close();
                return res.send(errResponse(baseResponse.NO_ACCESS_LOGIN));
              }
              
              await page.goto('https://www.citywaste.or.kr/portal/status/selectMyEmissionCharge.do');
              
              //로그인 버튼을 클릭해라
              await page.click('#real_contents > div > div > section > div > div:nth-child(3) > h4 > a');
              //로그인 화면이 전환될 때까지 .5초만 기다려라
              await page.waitForTimeout(500);
              
              console.log("login-Success");
              await wasteDao.saveUserInfo(connection, userId ,id, password, tagnum, dong, ho);
              //flag = 1;
              
              //브라우저 꺼라
              await browser.close(); 
              return res.send({ isSuccess:true, code:1000, message:"RFID 음식물 쓰레기 사용자 정보 저장 및 수정 완료!" });  
      
            } catch (error) {
              console.log(error);
            }
      
          })();
          connection.release();

        } else {
          // 있으면 정보 수정
          // 기존의 id 와 password 와 입력 받은 id와 password가 다르다면 
          const existChanged = await wasteDao.existChanged( connection, userId, id, password);
          if(existChanged.length < 1){
            // 변경 사항이 있으면

            (async () => {
              try {

                  const browser = await puppeteer.launch({
                      executablePath: '/usr/bin/chromium-browser',
                      headless: true,
                      args: ['--no-sandbox', '--disable-setuid-sandbox']
                  });


                const page = await browser.newPage();
        
                // Configure the navigation timeout
                await page.setDefaultNavigationTimeout(0);
        
                //페이지로 가라
                await page.goto('https://www.citywaste.or.kr/ucwmsNew/member/memberLogin.do');
        
                //아이디랑 비밀번호 란에 값을 넣어라 
                await page.evaluate((id, password) => {
                  document.querySelector('input[name="userid"]').value = id;
                  document.querySelector('input[name="userpwd"]').value = password;
                }, id, password);
        
        
                //로그인 버튼을 클릭해라
                await page.click('button[id="btn_login"]');
                //로그인 화면이 전환될 때까지 .5초만 기다려라
                await page.waitForTimeout(500);
        
        
                // //음쓰 페이지로 가서
                await page.goto('https://www.citywaste.or.kr/portal/status/selectSimpleEmissionQuantity.do');
                
                // 로그인 실패
                let temp2 = await page.$eval("#subMenu4", (data) => data.href);
                console.log(temp2);
                if(temp2.includes("javascript") && temp2.includes("alert")){
                  await browser.close();
                  return res.send(errResponse(baseResponse.NO_ACCESS_LOGIN));
                }
                
                await page.goto('https://www.citywaste.or.kr/portal/status/selectMyEmissionCharge.do');
                
                //로그인 버튼을 클릭해라
                await page.click('#real_contents > div > div > section > div > div:nth-child(3) > h4 > a');
                //로그인 화면이 전환될 때까지 .5초만 기다려라
                await page.waitForTimeout(500);
                
                console.log("login-Success");
                await wasteDao.updateUserInfo1( connection, userId ,id, password, tagnum, dong, ho );
                
                //브라우저 꺼라
                await browser.close(); 
                return res.send({ isSuccess:true, code:1000, message:"RFID 음식물 쓰레기 사용자 정보 저장 및 수정 완료!" });  
              
              } catch (error) {
                console.log(error);
            
              }
        
            })();
            connection.release();

           
          } else {
            // 변경사항이 없으면
            const userResult = await wasteDao.updateUserInfo2( connection, userId ,tagnum, dong, ho );
        
            connection.release();

            return res.send({ isSuccess:true, code:1000, message:"RFID 음식물 쓰레기 사용자 정보 저장 및 수정 완료!" });  
          }
          
        }

      
    } catch (error) {
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }

};