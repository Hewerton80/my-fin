"use client";
import React, { Fragment, use, useCallback, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/cards/Card";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { useGetTransiontionsHistotyByCategory } from "@/modules/transitionHistory/hooks/useGetTransiontionsHistotyByCategory";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns/format";
import { ImplicitLabelType } from "recharts/types/component/Label";
import { TransitionHistoryWitchConputedFields } from "@/modules/transitionHistory/types";

const teste: ImplicitLabelType = { x: 12, value: "" };

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function CustomLabel(props: any) {
  return (
    <text
      className="fill-black dark:fill-light text-xs"
      x={props?.x}
      y={props?.y}
      dy={-4}
      // fill={props?.stroke}
      textAnchor="middle"
    >
      {props?.value}
    </text>
  );
}

function CustomizedAxisTick(props: any) {
  const { x, y, stroke, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        // transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  );
}

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const {
    isLoadingTransitionsHistory,
    transitionsHistory,
    transitionsHistoryError,
    refetchTransitionsHistory,
  } = useGetTransiontionsHistotyByCategory(params.id);

  const getParsedDataChart = useCallback(
    (transitionsHistoryData: TransitionHistoryWitchConputedFields[]) => {
      return (
        transitionsHistoryData?.map((transitionHistory) => ({
          name: format(
            new Date(transitionHistory?.expense?.registrationDate!),
            "dd"
          ),
          description: transitionHistory?.name,
          amount: transitionHistory?.amount,
        })) || []
      );
    },
    []
  );

  const lineCharts = useMemo(() => {
    if (!transitionsHistory) return <></>;
    return months.map((month, i) => {
      const filteredCharts = transitionsHistory.filter(
        (transitionHistory) =>
          new Date(transitionHistory?.expense?.registrationDate!).getMonth() ===
          i
      );
      return (
        <Fragment key={month}>
          {filteredCharts?.length ? (
            <div className="flex flex-col">
              <h3>{month}</h3>
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={150}
                minHeight={150}
              >
                {/* <div className="size-10 bg-red-500"></div> */}
                <LineChart
                  // style={{ width: "100%" }}
                  data={getParsedDataChart(filteredCharts)}
                  // width={1000}
                  // height={500}
                  margin={{
                    top: 60,
                    right: 30,
                    left: 30,
                    // bottom: 5,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    tick={<CustomizedAxisTick />}
                    allowDataOverflow
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    label={<CustomLabel />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <></>
          )}
        </Fragment>
      );
    });
  }, [transitionsHistory, getParsedDataChart]);

  // useEffect(() => {
  //   console.log({ dataChart });
  // }, [dataChart]);

  if (isLoadingTransitionsHistory) {
    return (
      <Card.Root>
        <FeedBackLoading />
      </Card.Root>
    );
  }
  if (transitionsHistoryError) {
    return <FeedBackError onTryAgain={refetchTransitionsHistory} />;
  }
  return (
    <Card.Root>
      <Card.Body>
        {/* <LineChart
          style={{ width: "100%" }}
          width={2000}
          height={500}
          data={getParsedDataChart(transitionsHistory || [])}
        >
          <XAxis
            dataKey="name"
            tick={<CustomizedAxisTick />}
            allowDataOverflow
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            label={<CustomLabel />}
          />
        </LineChart> */}
        {lineCharts}
      </Card.Body>
    </Card.Root>
  );
}
