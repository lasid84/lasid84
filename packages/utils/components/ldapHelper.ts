//const ldap = require('ldapjs');
const ldap = require('ldapjs');

// LDAP 서버 정보
// const ldapServerUrl =  Config.load().get("main.sso");//'ldap://kwekr-dc-01.kwekr.local:389';
// const ldapServerUrl =  'ldap://kwekr-dc-01.kwekr.local:389';
// const baseDN = 'ou=kwekr_user,dc=kwekr,dc=local';

let ldapServerUrl = '';
let baseDN = '';


//OU=SDD_IT,OU=KWEKR_USER,dc=kwekr,dc=local

async function init() {

    var config = new Config("/configs/server.ini");
  //const config = Config("./configs/server.ini");
  await config.load();
  ldapServerUrl = config.get("sso.url");
  baseDN = 'ou=kwekr_user,dc=kwekr,dc=local';
}

// 사용자 인증 및 계정 체크 함수
async function checkAccount(user_id:any, password:any, callback:any) {
    console.log('start :', user_id, password);
    init();

    const client = ldap.createClient({
        url: ldapServerUrl, // LDAP 서버 주소와 포트
      });
    
    client.bind(`${user_id}@kwekr.local`, password, (err:any) => {
        if (err) {
          console.error('LDAP authentication failed:', err);
          callback(false, err.message)
        } else {
          console.log('LDAP authentication succeeded');
      
            // 사용자 정보 조회
            const searchFilter = `(sAMAccountName=${user_id})`;
            // const searchFilter = '(objectClass=person)';
            const options = {
                filter: searchFilter,
                scope:'sub',
                // attributes:['sAMAccountName']
              };
              
            let entries = [];  
            client.search(`${baseDN}`, { ...options}, (searchErr:any, searchRes:any) => {
                console.log("search start")
            if (searchErr) {
                console.error('Error searching for user:', searchErr);
            } else {
                
                searchRes.on('searchEntry', (entry:any) => {
                    const user = JSON.parse(JSON.stringify(entry.attributes));
                    // console.log('entry:', JSON.stringify(entry.attributes));
                    // console.log(user[1]["values"].toString())
                    callback(true, user[1]["values"].toString());
                  });
              
                searchRes.on('error', (error:any) => {
                    console.error('Error fetching user information:', error);
                  });

                  searchRes.on('searchReference', (ref:any) => {
                    console.error('searchReference', JSON.stringify(ref));
                  });
                  searchRes.on('page', (error:any) => {
                    console.error('page');
                  });

                searchRes.on('end', function(result:any) {
                    console.log('status: ' + result.status);

                    client.unbind((err:any) => {
                        if (err) {
                          console.error('Error while unbinding:', err);
                        } else {
                          console.log('Client unbound successfully.');
                        }});

                });
                
                console.log("search end")
            }
            });
        }
      });
};

// const ActiveDirectory = require('activedirectory2').promiseWrapper;

// // Active Directory 연결 설정
// const config = {
    
//     url: 'ldap://kwekr-dc-01.kwekr.local:389', // LDAP 서버 주소
//     bindDN: 'OU=KWEKR_USER,dc=kwekr,dc=local',
//     username: 'stephen.lim@kwekr.local', // 사용자 이름
//     password: '1q2w#E$R' // 비밀번호
//   };

// // 사용자 인증 및 계정 체크 함수
// function checkAccount(user_id, password, callback) {
//     console.log('start :', user_id, password);
    
//     const ad = new ActiveDirectory(config);

//     // 사용자 정보 조회
//     const username = 'stephen.lim@kwekr.local'; // 사용자 이름

//     ad.authenticate(username, password, function(err, auth) {
//         if (err) {
//             console.log('ERROR: ', err);
//             return;
//         }
//         if (!auth) {
//             console.log('Authentication failed!');
//         }
//         else {
//             console.log('Authenticated!');
//             // 사용자 정보 조회
//             // ad.findUser(username, (userErr, user) => {
//             //     console.log('findUser!');
//             //     if (userErr) {
//             //         console.error('Error fetching user information:', userErr);
//             //     } else {
//             //         console.log('User Information:', user);
//             //     }
//             // });
//         }
//     });

//     // ad.findUser(username, (err, user) => {
//     //     if (err) {
//     //         console.error('Error searching for user:', err);
//     //     } else {
//     //         console.log('User Information:', user);
//     //     }   
//     // });
// };

module.exports = checkAccount;  