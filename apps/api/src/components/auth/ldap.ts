import ldap, { SearchOptions } from 'ldapjs';

import { log, error } from '@repo/kwe-lib-new';

type CheckAccountCallback = (success: boolean, value: string | null, error?: string | Error) => void;

export const checkAccount = async (
  user_id: string, 
  password: string, 
  callback: CheckAccountCallback
): Promise<void> => {
  try {

    let ldapServerUrl = process.env.SSO_URL || '';
    let baseDN = process.env.SSO_BASE_DN;

    const client = ldap.createClient({
      url: ldapServerUrl, 
      connectTimeout: 5000
    });
    user_id = user_id.replace('@kwe.com', '');
    client.bind(`${user_id}@kwekr.local`, password, (err: Error | null) => {
      if (err) {
        error('LDAP authentication failed1:', err);
        callback(false, null, err.message);
      } else {
        log('Trying login', user_id);

        // 사용자 정보 검색
        const searchFilter = `(sAMAccountName=${user_id})`;
        const options: SearchOptions = {
          filter: searchFilter,
          scope: 'sub'
        };

        client.search(`${baseDN}`, options, (searchErr, searchRes) => {
          if (searchErr) {
            console.error('Error searching for user:', searchErr);
            callback(false, null, searchErr);
          } else {

            searchRes.on('searchEntry', (entry) => {
              const user = JSON.parse(JSON.stringify(entry.attributes));  
              callback(true, user[1]["values"].toString());
            });

            searchRes.on('error', (error: Error) => {
              console.error('Error fetching user information:', error);
              callback(false, null, error);
            });

            searchRes.on('searchReference', (ref: any) => {
              console.error('searchReference', JSON.stringify(ref));
              callback(false, null, JSON.stringify(ref));
            });

            searchRes.on('page', (error: Error) => {
              console.error('page', error);
              callback(false, null, error);
            });

            searchRes.on('end', function(result: any) {
              client.unbind((unbindErr: Error | null) => {
                if (unbindErr) {
                  log('Error while unbinding:', unbindErr);
                  callback(false, null, unbindErr);
                } else {
                  log('Client unbound successfully.');
                }
              });
            });

            log("search end");
          }
        });
      }
    });
  } catch (ex) {
    error("1. ", ex);
  }
};

// // 사용자 인증 및 계정 체크 함수
// const checkAccount2 = async (user_id: string, password: string, callback) => {
//     // log('start :', user_id, password);
//     try {

//       const client = ldap.createClient({
//           url: ldapServerUrl, // LDAP 서버 주소와 포트
//           connectTimeout:5000
//         });
      
//       client.bind(`${user_id}@kwekr.local`, password, (err) => {
//           if (err) {
//             console.error('LDAP authentication failed:', err);
//             callback(false, null, err.message)
//           } else {
//               log('Trying login', user_id);
        
//               // 사용자 정보 조회
//               const searchFilter = `(sAMAccountName=${user_id})`;
//               // const searchFilter = '(objectClass=person)';
//               const options = {
//                   filter: searchFilter,
//                   scope:'sub',
//                   // attributes:['sAMAccountName']
//                 };
                
//               let entries = [];  
//               client.search(`${baseDN}`, { ...options}, (searchErr, searchRes) => {
//                   // log("search start")
//               if (searchErr) {
//                   console.error('Error searching for user:', searchErr);
//                   callback(false, null, searchErr)
//               } else {
                  
//                   searchRes.on('searchEntry', (entry) => {
//                       const user = JSON.parse(JSON.stringify(entry.attributes));
//                       // console.log('entry:', JSON.stringify(entry.attributes));
//                       // console.log(user[1]["values"].toString())
//                       callback(true, user[1]["values"].toString());
//                     });
                
//                   searchRes.on('error', (error) => {
//                       console.error('Error fetching user information:', error);
//                       callback(false, null, error)
//                     });

//                     searchRes.on('searchReference', (ref) => {
//                       console.error('searchReference', JSON.stringify(ref));
//                       callback(false, null, JSON.stringify(ref));
//                     });
//                     searchRes.on('page', (error) => {
//                       console.error('page');
//                       callback(false, null, error);
//                     });

//                   searchRes.on('end', function(result) {
//                       // log('status: ' + result.status);

//                       client.unbind((err) => {
//                           if (err) {
//                             log('Error while unbinding:', err);
//                             callback(false, null, err);
//                           } else {
//                             log('Client unbound successfully.');
//                           }});

//                   });
                  
//                   log("search end")
//               }
//               });
//           }
//         })
//         ;
//       } catch (ex) {
//         error("1. ", ex);
//       }
// };
