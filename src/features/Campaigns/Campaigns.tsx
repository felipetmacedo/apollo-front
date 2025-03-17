import { CampaignsPage } from "./CampaignsPage";

export function Campaigns() {
    return (
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            <CampaignsPage />
        </div>
    )
}