import Widget1 from "components/dashboard/widget-1";
import SectionTitle from "components/dashboard/section-title";
import {FiActivity, FiUsers, FiExternalLink, FiClock} from "react-icons/fi";
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <SectionTitle title={t('overview')} subtitle={t('dashboard')} />

      <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Users"
            description={588}
            right={
              <FiUsers size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Sessions"
            description={435}
            right={
              <FiActivity size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Bounce rate"
            description="40.5%"
            right={
              <FiExternalLink
                size={24}
                className="text-gray-500 stroke-current"
              />
            }
          />
        </div>
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Session duration"
            description="1m 24s"
            right={
              <FiClock size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
      </div>

    </>
  );
};
export default Index;
