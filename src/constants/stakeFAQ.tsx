export const stakeFAQ = [
  {
    title: 'What is the cooldown period?',
    content: (
      <p>
        The cooldown is how long you have to wait to withdraw a stake. It is a "safety module". The
        idea is that you can't immediately withdraw your staked tokens, since you are staking to
        protect from a shortfall event.
      </p>
    ),
  },
  {
    title: 'What is a shortfall?',
    content: (
      <p>
        <a
          href="https://www.investopedia.com/terms/s/shortfall.asp"
          rel="noreferrer"
          target="_blank"
        >
          Click here
        </a>{' '}
        for a definition of shortfall.
      </p>
    ),
  },
  {
    title: 'What happens when I click on "Activate Cooldown?',
    content: (
      <p>
        When you activate the cooldown period you'll have to wait 10 days before unstaking your
        tokens. Then, you'll have 2 days to click "unstake" {'-->'} window closes.
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
    content: <p>Yes! You receive staking rewards until you don't unstake your tokens.</p>,
  },
  {
    title: 'Will it be possible to vote with stkAGVE too?',
    content: (
      <p>
        Yes. Through Snapshot Voting at the time of the Snapshot you can vote with your agave
        holdings, both on your wallet and on the Safety Module.
      </p>
    ),
  },
] as Array<{ title: string; content: React.ReactNode }>
