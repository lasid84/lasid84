'use client'

import { Component, Fragment, useEffect, useState } from "react";
import {useNavigation, setNavigationData} from "@/app/states/useNavigation";
import Item from "./item";
import LogoImg from "./logo-img";
import { auth } from "@/auth"
import { useStore } from "@/app/utils/zustand";
import { useUserSettings } from "@/app/states/useUserSettings";

import { useSession } from "next-auth/react"
const { log } = require("@repo/kwe-lib/components/logHelper");

// export default function LeftSidebar() {
const LeftSidebar: React.FC = () => {
        const userSettingsActions = useStore(useUserSettings, (state) => state.actions);
    const { data: session, update } = useSession()
    
    const navigation = useNavigation((state) => state.navigation);  
  
    //   useEffect(() => {

    //     () => {
    //         const userData = session?.user;
    //         console.log("LeftSidebar start", userData.user_id); 
    //         userSettingsActions!.setData(userData);    
    //         console.log("LeftSidebar start useUserSettings", useUserSettings.getState().data);    
            
    //         setNavigationData();
    //     }
        // const userData = session?.user;
        
        // () => {
        //     aa();
        // }          
    //   });

      useEffect(() => {
        ;(async () => {          
            const userData = await session?.user;
            // console.log("LeftSidebar start", userData.user_id); 
            // userSettingsActions!.setData({user_id: userData.user_id});    
            // console.log("LeftSidebar start useUserSettings", useUserSettings.getState().data);    
            
            await aa(userData);

            setNavigationData();        
          
        })()
      }, [])


    const aa = (async (userData:any) => {
        
        console.log("LeftSidebar start", userData.user_id); 
        () => {
            userSettingsActions!.setData(userData);    
        }
        console.log("LeftSidebar start useUserSettings"); 
    });

  
    return (
      <div className="text-gray-900 h-screen bg-white left-sidebar left-sidebar-1 dark:bg-[#dce2eb] dark:border-gray-800 dark:text-black w-[230px]">
        
        <LogoImg />
          <div className="left-sidebar-body h-[calc(100vh-60px)] dark:bg-[#dce2eb] border-r dark:border-[#c7d0dc]">
              {navigation.map((menu, i) => (
                  <Fragment key={i}>
                      <ul>
                          {menu.items.map((l0, a) => (
                              <li key={a} className="l0 border-b border-[#F2F2F2] dark:border-[#c7d0dc]">
                                  <Item {...l0} />
                                  <ul className='bg-[#FAFAFA] dark:bg-[#e9eef5] border-l-4 border-l-[#005EB8] w-[230px]'>
                                      {l0.items.map((l1, b) => (
                                          <li key={b} className="l1">
                                              <Item {...l1} />
                                              <ul>
                                                  {l1.items.map((l2, c) => (
                                                      <li key={c} className="l2">
                                                          <Item {...l2} />
                                                          <ul>
                                                              {l2.items.map((l3, d) => (
                                                                  <li key={d} className="l3">
                                                                      <Item {...l3} />
                                                                      <ul>
                                                                          {l3.items.map((l4, e) => (
                                                                              <li key={e} className="l4">
                                                                                  <Item {...l4} />
                                                                              </li>
                                                                          ))}
                                                                      </ul>
                                                                  </li>
                                                              ))}
                                                          </ul>
                                                      </li>
                                                  ))}
                                              </ul>
                                          </li>
                                      ))}
                                  </ul>
                              </li>
                          ))}
                      </ul>
                  </Fragment>
              ))}
          </div>
      </div>
    );
  };
  
  export default LeftSidebar;
  