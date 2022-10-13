import { Select } from "@components/common/Select";
import React, { useMemo, useState } from "react";
import { MainLayout } from "./MainLayout";

export const Setting = React.memo(() => {
  const optionsGateway: any[] = useMemo(() => {
    return [
      { text: "Gateway 1" },
      { text: "Gateway 2" },
      { text: "Gateway 3" },
      { text: "Gateway 4" },
    ];
  }, []);
  const optionsStrategy: any[] = useMemo(() => {
    return [
      { text: "Random" },
      { text: "77777" },
      { text: "88888" },
      { text: "99999" },
    ];
  }, []);
  const [currentGateway, setGateway] = useState(optionsGateway[0]);
  const [currentStrategy, setStrategy] = useState(optionsStrategy[0]);

  return (
    <MainLayout menuId={2}>
      <div className="flex-1 h-full overflow-y-auto">
        <div className=" m-8 px-8 py-[1.5625rem] border-solid border-black-1 border">
          <div className=" font-medium text-xl">Preferences</div>
          <div className=" mt-4 whitespace-nowrap flex items-center">
            <span className="font-medium text-lg">
              Choose preferred gateway :
            </span>
            <Select
              className=" ml-2"
              options={optionsGateway}
              current={currentGateway}
              onOptionChange={setGateway}
            />
          </div>
          <div className=" mt-4 whitespace-nowrap flex items-center">
            <span className="font-medium text-lg">
              Gateway Match Strategy :
            </span>
            <Select
              className=" ml-2"
              options={optionsStrategy}
              current={currentStrategy}
              onOptionChange={setStrategy}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
});
