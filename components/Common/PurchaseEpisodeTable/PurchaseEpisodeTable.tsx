import React, { useEffect, useState } from "react";
import { 
  Checkbox, 
  DateTime, 
  DiscountText, 
  EpisodeTitle, 
  StatusIcon, 
  StatusTitle, 
  Table, 
  TableWrapper, 
  Title, 
  TitleRow, 
  ToggleButton 
} from "./PurchaseEpisodeTable.styles";
import { Salon } from "@prisma/client";
import { logSeriesTicketInputEpisodeSelect } from "@utils/analytics-helpers";

type Episode = {
  id: string;
  date: string;
  title: string;
  status: "Online" | "In Person";
};

interface PurchaseEpisodeTableProps {
  salons: Salon[];
  onSelectEpisodes: (selected: string[]) => void;
}

const PurchaseEpisodeTable: React.FC<PurchaseEpisodeTableProps> = (props) => {
  const { salons, onSelectEpisodes } = props;

  const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
  const [isTableVisible, setIsTableVisible] = useState(true);
  
  const episodes: Episode[] = salons?.filter(salon => salon.state === "APPROVED")?.map(salon => ({
    id: salon.id,
    date: new Date(salon.startTime).toLocaleString("en-US", {
      timeZone: "CET",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " CET",
    title: salon.title,
    status: salon.locationType === "VIRTUAL" ? "Online" : "In Person",
  })) || [];

  useEffect(() => {
    onSelectEpisodes(selectedEpisodes);
    // logSeriesTicketInputEpisodeSelect(selectedEpisodes);
  }, [selectedEpisodes, onSelectEpisodes]);

  useEffect(() => {
    selectAllEpisodes(true);
  }, []);

  const selectAllEpisodes = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedEpisodes(episodes.map((ep) => ep.id));
    } else {
      setSelectedEpisodes([]);
    }
  };

  const allSelected = selectedEpisodes.length === episodes.length;

  const toggleTableVisibility = () => setIsTableVisible(!isTableVisible);

  const toggleEpisodeSelection = (id: string) => {
    setSelectedEpisodes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((episodeId) => episodeId !== id)
        : [...prevSelected, id]
    );
  };

  return episodes && episodes.length > 0 && (
    <>
      <TitleRow>
        <Title>More episodes</Title>
        <ToggleButton isOpen={isTableVisible} onClick={toggleTableVisibility} type="button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_9585_34877)">
              <path
                d="M10 6.66797L5 11.668L6.175 12.843L10 9.0263L13.825 12.843L15 11.668L10 6.66797Z"
                fill="#FC714E"
              />
            </g>
            <defs>
              <clipPath id="clip0_9585_34877">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </ToggleButton>
      </TitleRow>

      <TableWrapper isOpen={isTableVisible}>
        {episodes.length > 2 && <DiscountText>
          Purchase tickets for 2 more episodes in this series and get a{" "}
          <span>20% discount</span> on the rest.
        </DiscountText>}

        <Table>
          <thead>
            <tr>
              <th>
                <Checkbox
                  checked={allSelected}
                  disabled={allSelected}
                  onClick={() => !allSelected && selectAllEpisodes(!allSelected)}
                >
                  {allSelected ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 16H2V2H16V16ZM14.99 6L13.58 4.58L6.99 11.17L4.41 8.6L2.99 10.01L6.99 14L14.99 6Z"
                        fill="#AEA5A5"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="0.5" y="0.5" width="17" height="17" stroke="#231F20" />
                    </svg>
                  )}
                </Checkbox>
              </th>
              <th>Date</th>
              <th>Episode Title</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode) => {
              const isSelected = selectedEpisodes.includes(episode.id);
              return (
                <tr key={episode.id}>
                  <td>
                    <Checkbox
                      checked={isSelected}
                      onClick={() => toggleEpisodeSelection(episode.id)}
                    >
                      {isSelected ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM16 16H2V2H16V16ZM14.99 6L13.58 4.58L6.99 11.17L4.41 8.6L2.99 10.01L6.99 14L14.99 6Z"
                            fill="#231F20"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="0.5" y="0.5" width="17" height="17" stroke="#231F20" />
                        </svg>
                      )}
                    </Checkbox>
                  </td>
                  <td>
                    <DateTime>{episode.date}</DateTime>
                  </td>
                  <td>
                    <EpisodeTitle>{episode.title}</EpisodeTitle>
                    <StatusTitle>
                      <StatusIcon>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 6H11M1 6C1 8.76142 3.23858 11 6 11M1 6C1 3.23858 3.23858 1 6 1M11 6C11 8.76142 8.76142 11 6 11M11 6C11 3.23858 8.76142 1 6 1M6 1C7.25064 2.36918 7.96138 4.14602 8 6C7.96138 7.85398 7.25064 9.63082 6 11M6 1C4.74936 2.36918 4.03862 4.14602 4 6C4.03862 7.85398 4.74936 9.63082 6 11" stroke="#231F20" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </StatusIcon>
                      {episode.status}
                    </StatusTitle>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
    </>
  );
};

export default PurchaseEpisodeTable;
