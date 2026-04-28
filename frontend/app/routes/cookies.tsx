import PageContainer from "../../src/components/ui/PageContainer";
import type { Route } from "./+types/cookies";
import { buildMeta } from "../../src/lib/seo";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Cookie Policy | TLDR History",
    description:
      "Read the TLDR History cookie policy to understand how cookies and similar technologies are used across the site.",
    path: "/cookies",
    type: "website",
  });
}

export default function Cookies() {
  return (
    <PageContainer>
      <div className="py-16 sm:py-24 p-4 sm:p-6 z-10">
        <h1 className="text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center">
          Cookie Policy
        </h1>
        <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-xl border border-stone-900 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-4 shadow-xl shadow-stone-950/40 sm:gap-5 sm:p-6">
          <div className="space-y-5 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400 sm:text-sm">
              Last updated April 13, 2026
            </p>
       
         
              <p>
                This Cookie Policy explains how Robert Morgan ("Company," "we,"
                "us," and "our") uses cookies and similar technologies to
                recognize you when you visit our website at {" "}
                <a
                  href="https://tldrhistory.xyz"
                  className="text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                >
                  https://tldrhistory.xyz
                </a> {" "}
                ("Website"). It explains what these technologies are and why we
                use them, as well as your rights to control our use of them.
              </p>
              <p>
                In some cases we may use cookies to collect personal
                information, or that becomes personal information if we combine
                it with other information.
              </p>
            </div>
          <section
            id="section1"
            className="space-y-8 pt-12"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
                What are cookies?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>
                Cookies are small data files that are placed on your computer or
                mobile device when you visit a website. Cookies are widely used
                by website owners in order to make their websites work, or to
                work more efficiently, as well as to provide reporting
                information.
              </p>
              <p>
                Cookies set by the website owner (in this case, Robert Morgan)
                are called "first-party cookies." Cookies set by parties other
                than the website owner are called "third-party cookies."
                Third-party cookies enable third-party features or functionality
                to be provided on or through the website (e.g., advertising,
                interactive content, and analytics). The parties that set these
                third-party cookies can recognize your computer both when it
                visits the website in question and also when it visits certain
                other websites.
              </p>
            </div>
          </section>
          <section
            id="section2"
            className="space-y-8 pt-12 border-t border-stone-800"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
                Why do we use cookies?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>
                We use first- and third-party cookies for several reasons. Some
                cookies are required for technical reasons in order for our
                Website to operate, and we refer to these as "essential" or
                "strictly necessary" cookies. Other cookies also enable us to
                track and target the interests of our users to enhance the
                experience on our Online Properties. Third parties serve cookies
                through our Website for advertising, analytics, and other
                purposes. This is described in more detail below.
              </p>
            </div>
          </section>
          <section
            id="section3"
            className="space-y-8 pt-12 border-t border-stone-800"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
                How can I control cookies?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>
                You have the right to decide whether to accept or reject
                cookies. You can exercise your cookie rights by setting your
                preferences in the Cookie Preference Center. The Cookie
                Preference Center allows you to select which categories of
                cookies you accept or reject. Essential cookies cannot be
                rejected as they are strictly necessary to provide you with
                services.
              </p>
              <p>
                The Cookie Preference Center can be found in the notification
                banner and on our Website. If you choose to reject cookies, you
                may still use our Website though your access to some
                functionality and areas of our Website may be restricted. You
                may also set or amend your web browser controls to accept or
                refuse cookies.
              </p>
              <p>
                The specific types of first- and third-party cookies served
                through our Website and the purposes they perform are described
                in the table below (please note that the specific cookies served
                may vary depending on the specific Online Properties you visit):
              </p>
            </div>
          </section>
          <section
            id="section4"
            className="space-y-8 pt-12 border-t border-stone-800"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
                How can I control cookies on my browser?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>
                As the means by which you can refuse cookies through your web
                browser controls vary from browser to browser, you should visit
                your browser's help menu for more information. The following is
                information about how to manage cookies on the most popular
                browsers:
              </p>
              <ul className="space-y-3 pl-5 text-stone-300 marker:text-stone-500 list-disc">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Internet Explorer
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Edge
                  </a>
                </li>
                <li>
                  <a
                    href="https://help.opera.com/en/latest/web-preferences/"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Opera
                  </a>
                </li>
              </ul>
              <p>
                In addition, most advertising networks offer you a way to opt
                out of targeted advertising. If you would like to find out more
                information, please visit:
              </p>
              <ul className="space-y-3 pl-5 text-stone-300 marker:text-stone-500 list-disc">
                <li>
                  <a
                    href="https://optout.aboutads.info/"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Digital Advertising Alliance
                  </a>
                </li>
                <li>
                  <a
                    href="https://youradchoices.ca/"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    Digital Advertising Alliance of Canada
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youronlinechoices.com/"
                    target="_blank"
                    className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                  >
                    European Interactive Digital Advertising Alliance
                  </a>
                </li>
              </ul>
            </div>
          </section>
          <section
            id="section5"
            className="space-y-8 pt-12 border-t border-stone-800"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
                What about other tracking technologies, like web beacons?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>
                Cookies are not the only way to recognize or track visitors to a
                website. We may use other, similar technologies from time to
                time, like web beacons (sometimes called "tracking pixels" or
                "clear gifs"). These are tiny graphics files that contain a
                unique identifier that enables us to recognize when someone has
                visited our Website or opened an email including them. This
                allows us, for example, to monitor the traffic patterns of users
                from one page within a website to another, to deliver or
                communicate with cookies, to understand whether you have come to
                the website from an online advertisement displayed on a
                third-party website, to improve site performance, and to measure
                the success of email marketing campaigns. In many instances,
                these technologies are reliant on cookies to function properly,
                and so declining cookies will impair their functioning.
              </p>
            </div>
          </section>
          <section
            id="section6"
            className="space-y-8 pt-12 border-t border-stone-800"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
                Do you use Flash cookies or Local Shared Objects?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>
                Websites may also use so-called "Flash Cookies" (also known as
                Local Shared Objects or "LSOs") to, among other things, collect
                and store information about your use of our services, fraud
                prevention, and for other site operations.
              </p>
              <p>
                If you do not want Flash Cookies stored on your computer, you
                can adjust the settings of your Flash player to block Flash
                Cookies storage using the tools contained in the{" "}
                <a
                  href="https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html"
                  target="_blank"
                  className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                >
                  Website Storage Settings Panel
                </a>
               . You can also control Flash Cookies by going to
                the{" "}
                <a
                  href="https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html"
                  target="_blank"
                  className="text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                >
                  Global Storage Settings Panel
                </a>{" "}
                and following the instructions (which may include instructions
                that explain, for example, how to delete existing Flash Cookies
                (referred to "information" on the Macromedia site), how to
                prevent Flash LSOs from being placed on your computer without
                your being asked, and (for Flash Player 8 and later) how to
                block Flash Cookies that are not being delivered by the operator
                of the page you are on at the time).
              </p>
              <p>
                Please note that setting the Flash Player to restrict or limit
                acceptance of Flash Cookies may reduce or impede the
                functionality of some Flash applications, including,
                potentially, Flash applications used in connection with our
                services or online content.
              </p>
            </div>
          </section>
          <section
            id="section7"
            className="space-y-8 pt-12 border-t border-stone-800"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
                How often will you update this Cookie Policy?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>
                We may update this Cookie Policy from time to time in order to
                reflect, for example, changes to the cookies we use or for other
                operational, legal, or regulatory reasons. Please therefore
                revisit this Cookie Policy regularly to stay informed about our
                use of cookies and related technologies.
              </p>
              <p>
                The date at the top of this Cookie Policy indicates when it was
                last updated.
              </p>
            </div>
          </section>
           <section
            id="section8"
            className="space-y-8 pt-12 border-t border-stone-800"
          >
            <div>
              <h2 className="text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2">
               Where can I get further information?
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              <p>If you have any questions about our use of cookies or other technologies, please contact us at:
              
              </p>
              <div className="bg-stone-800/50 border border-stone-600 rounded-lg p-6">
                <p className="font-medium text-stone-200 mb-1">Robert Morgan</p>
                <p className="text-stone-300">23 Hill View</p>
                <p className="text-stone-300">
                  Cardiff, South Glamorgan CF5 3UB
                </p>
                <p className="text-stone-300">United Kingdom</p>
                <p className="text-stone-300 font-bold">Phone: +639543954764</p>
                <a
                  href="mailto:support@mail.tldrhistory.xyz"
                  target="_blank"
                  className="text-stone-200 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium"
                >
                  support@mail.tldrhistory.xyz
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
