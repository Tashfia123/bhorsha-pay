// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    
struct Campaign {
    address owner;
    string title;
    string description;
    uint256 target;
    uint256 deadline;
    uint256 collected_amount;
    string image;
    address[] donators;
    uint256[] donations;

}
mapping (uint256 => Campaign) public campaigns;

uint256 public number_campaigns =0;

function create_campaign (address _owner,string memory _title,string memory _description, uint256  _target,uint256 _deadline,string memory _image) public returns (uint256){

    Campaign storage campaign= campaigns[number_campaigns];
    require(campaign.deadline <block.timestamp ,"Invalid Deadline"); 

    campaign.owner= _owner;
    campaign.title= _title;
    campaign.description= _description;
    campaign.target= _target;
    campaign.deadline=_deadline;
    campaign.image=_image;
    campaign.collected_amount=0;

    number_campaigns++;

    return number_campaigns-1;   }

function donate_to_campaign (uint256 _id) public payable {
    uint256 amount=msg.value;
    Campaign storage campaign =  campaigns[_id];
    campaign.donators.push(msg.sender); 
    campaign.donations.push(amount);
    (bool sent,)=payable(campaign.owner).call{value : amount}("");

    if(sent) {
        campaign.collected_amount+=amount;
    }
}
function get_donators (uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }
function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](number_campaigns);

        for(uint i = 0; i < number_campaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }


}