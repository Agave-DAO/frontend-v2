export const stakeFAQ = [
  {
    title: 'What is the cooldown period?',
    content: (
      <p>
        The cooldown is how long you have to wait to withdraw a stake. The idea is that you can't
        immediately withdraw your staked tokens to guarantee you cannot attempt Governance abuse
        without consequence. Additionally it aligns long-term holders by rewarding them for their
        loyalty.
      </p>
    ),
  },
  {
    title: 'What happens when I click on "Activate Cooldown?',
    content: (
      <p>
        Once 'Activate Cooldown' is clicked a 10 day window period will start. After the 10 days
        pass, you'll have a 2 days claim window to withdraw your sweet <b>$AGVE</b> to your wallet.
      </p>
    ),
  },
  {
    title: "What happens if you don't withdraw during 2 day window?",
    content: (
      <p>
        If you don't withdraw within 2 days, the window closes and you have to reactivate the
        cooldown period.
      </p>
    ),
  },
  {
    title: 'Do I still receive staking rewards during the cooldown period?',
    content: <p>Yes! You'll receive staking rewards until you effectively unstake your tokens.</p>,
  },
  {
    title: 'Is it possible to vote with stkAGVE too?',
    content: (
      <p>
        Yes. Through Snapshot Voting at the time of the Snapshot you can vote with your agave
        holdings, both on your wallet and on the Staking Module. stkAGVE additionally, is
        exclusively used as the bond that enforces the consensus to be executed.
      </p>
    ),
  },
] as Array<{ title: string; content: React.ReactNode }>
