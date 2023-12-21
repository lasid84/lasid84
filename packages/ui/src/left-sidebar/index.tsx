import {Fragment} from "react";
import {useNavigation} from 'states/useNavigation';
import Title from "left-sidebar/title";
import Item from "left-sidebar/item";
import Logo from "left-sidebar/logo";

const LeftSidebar: React.FC = () => {
  const navigation = useNavigation((state) => state.navigation);
  return (
    <div className="text-gray-900 bg-white dark:bg-gray-900 dark:text-white left-sidebar-3 space-y-4">
      <Logo />
      {navigation.map((menu, i) => (
        <Fragment key={i}>
          <Title>{menu.title}</Title>
          <ul>
            {menu.items.map((l0, a) => (
              <li key={a} className="l0">
                <Item {...l0} />
                <ul>
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
  );
};

export default LeftSidebar;
