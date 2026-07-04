const { test, expect } = require('@playwright/test');

const positionsPayload = [
  {
    id: 1,
    title: 'Senior Backend Engineer',
    manager: 'John Doe',
    deadline: '2024-12-31',
    status: 'Open',
  },
];

const interviewFlowPayload = {
  interviewFlow: {
    positionName: 'Senior Backend Engineer',
    interviewFlow: {
      id: 1,
      description: 'Proceso de contratación',
      interviewSteps: [
        {
          id: 101,
          interviewFlowId: 1,
          interviewTypeId: 1,
          name: 'Screening',
          orderIndex: 1,
        },
        {
          id: 102,
          interviewFlowId: 1,
          interviewTypeId: 2,
          name: 'Technical',
          orderIndex: 2,
        },
        {
          id: 103,
          interviewFlowId: 1,
          interviewTypeId: 3,
          name: 'Final',
          orderIndex: 3,
        },
      ],
    },
  },
};

const initialCandidatesPayload = [
  {
    id: 1,
    applicationId: 1001,
    fullName: 'Ana García',
    currentInterviewStep: 'Screening',
    averageScore: 4.5,
  },
];

let candidatesPayload = [];

const waitForPageLoad = async (page) => {
  await page.waitForLoadState('networkidle');
  await expect(
    page.getByRole('heading', { name: /Posiciones/i })
  ).toBeVisible();
};

test.describe('Position page end-to-end flow', () => {
  test.beforeEach(async ({ page }) => {
    candidatesPayload = structuredClone(initialCandidatesPayload);

    await page.route('**/position', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(positionsPayload),
      });
    });

    await page.route('**/position/1/interviewflow', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(interviewFlowPayload),
      });
    });

    await page.route('**/position/1/candidates', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(candidatesPayload),
      });
    });

    await page.route('**/candidates/1', async (route) => {
      const request = route.request();

      if (request.method() === 'PUT') {
        candidatesPayload = candidatesPayload.map((candidate) =>
          candidate.id === 1
            ? {
                ...candidate,
                currentInterviewStep: 'Technical',
              }
            : candidate
        );
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Candidate stage updated',
          data: {
            id: 1,
            positionId: 1,
            candidateId: 1,
            currentInterviewStep: 102,
          },
        }),
      });
    });

    await page.goto('/positions');
    await waitForPageLoad(page);
  });

  test('navigates to the Position page and loads available positions', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: /Ver proceso/i }).first()
    ).toBeVisible();

    await expect(page.getByText(/Manager:/i).first()).toBeVisible();
  });

  test('loads interview stages, renders candidates, and supports drag and drop between stages', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /Ver proceso/i }).first().click();

    await expect(
      page.getByRole('heading', { name: /Senior Backend Engineer/i })
    ).toBeVisible();

    const stageSections = page.locator('section[role="region"]');

    await expect(stageSections).toHaveCount(3);

    const sourceCard = page.locator('div[role="button"]').first();

    await expect(sourceCard).toBeVisible();

    const targetStage = stageSections.nth(1);

    const sourceBox = await sourceCard.boundingBox();
    const targetBox = await targetStage.boundingBox();

    expect(sourceBox).not.toBeNull();
    expect(targetBox).not.toBeNull();

    const updateRequest = page.waitForRequest((request) => {
      return (
        request.method() === 'PUT' &&
        request.url().includes('/candidates/1')
      );
    });

    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );

    await page.mouse.down();

    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + 40,
      {
        steps: 20,
      }
    );

    await page.mouse.up();

    await updateRequest;

    await expect(
      targetStage.getByText('Ana García')
    ).toBeVisible();
  });

  test('shows accessible regions and supports back navigation', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /Ver proceso/i }).first().click();

    const regions = page.locator('section[role="region"]');

    await expect(regions).toHaveCount(3);

    await expect(page.locator('div[role="button"]')).toHaveCount(1);

    await page.getByRole('button', { name: /Volver/i }).click();

    await expect(
      page.getByRole('heading', { name: /Posiciones/i })
    ).toBeVisible();
  });

  test('renders a responsive layout on a smaller viewport', async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    await page.reload();

    await waitForPageLoad(page);

    await expect(
      page.getByRole('heading', { name: /Posiciones/i })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Ver proceso/i }).first()
    ).toBeVisible();
  });
});