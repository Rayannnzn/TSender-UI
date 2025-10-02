import basicSetup from "../wallet-setup/basic.setup"
import { testWithSynpress } from "@synthetixio/synpress"
import {MetaMask,metaMaskFixtures} from "@synthetixio/synpress/playwright"

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const {expect} = test

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("TS Sender UI");
});

test("It Should Show The Airdrop Form When Connected,Otherwise Not",async ({page,context,metamaskPage,extensionId}) => {
  await page.goto('./');

  await expect(page.getByText('Please Connect Your Wallet')).toBeVisible;


  const metamask = new MetaMask(context,metamaskPage,extensionId,basicSetup.walletPassword)
  await page.getByTestId('rk-connect-button').click()
  await page.getByTestId('rk-wallet-optionio.metamask').waitFor({
    state: 'visible',
    timeout: 30000
  })

  await page.getByTestId('rk-wallet-optionio.metamask').click()
  await metamask.connectToDapp()
})


