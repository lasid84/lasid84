'use client'

import { Fragment, useEffect } from "react";
import { useNavigation, setNavigationData } from "states/useNavigation";
import Title from "components/left-sidebar-1/title";
import Item from "components/left-sidebar-1/item";
import LogoImg from "components/left-sidebar-1/logo-img";
import { useUserSettings } from "states/useUserSettings";
import { useSession } from 'next-auth/react';
const { log } = require("@repo/kwe-lib/components/logHelper");

interface Props {
    Children?: JSX.Element | JSX.Element[]
}

const LeftSidebar: React.FC<Props> = () => {
    // const { data: session } = useSession();
    const navigation = useNavigation((state) => state.navigation);

    useEffect(() => {
        // log("LeftSidebar start");
        setNavigationData();
    }, []);

    return (
        <div className="text-gray-900 h-screen bg-white left-sidebar left-sidebar-1 dark:bg-[#1f2937] dark:border-gray-800 dark:text-black w-[230px]">
          <LogoImg />
          <div className="left-sidebar-body h-[calc(100vh-60px)] dark:bg-[#dce2eb] border-r dark:border-[#c7d0dc]">
            {/*<div className="dark:bg-[#dce2eb] border-r dark:border-[#c7d0dc]">*/}
            {navigation.map((menu, i) => (
              <Fragment key={i}>
                {/* <Title>{menu.title}</Title> */}
                <ul>
                  {menu.items.map((l0, a) => (
                    <li key={a} className="l0 border-b border-[#F2F2F2] dark:border-[#c7d0dc]">
                      <Item {...l0} />
                      <ul className="bg-[#FAFAFA] dark:bg-[#e9eef5] border-l-4 border-l-[#005EB8] w-[230px]">
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
