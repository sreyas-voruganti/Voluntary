<template>
  <div class="container px-3">
    <section
      class="hero is-light mt-6"
      style="border-radius: 10px; background: linear-gradient(0deg, rgba(189,255,225,1) 0%, rgba(184,246,255,1) 100%); box-shadow: 10px 10px 5px lightgrey;"
    >
      <div class="hero-body">
        <p class="title">
          Welcome to Voluntary (Early Beta)
        </p>
        <p class="subtitle is-4">
          Free Lessons from Volunteer Mentors
        </p>
        <button
          class="button is-light is-danger is-large mt-3"
          @click="onClick"
          :disabled="accType == 'choose'"
        >
          <span class="icon">
            <i class="fab fa-google"></i>
          </span>
          <span>Continue with Google</span>
        </button>
        <div class="field mt-2">
          <label class="label"
            >Account Type
            <a
              @click="showTypeModal = true"
              class="has-text-weight-medium has-text-link"
              >Info</a
            ></label
          >
          <div class="control">
            <div class="select is-success">
              <select v-model="accType">
                <option disabled>choose</option>
                <option>client</option>
                <option>mentor</option>
              </select>
            </div>
          </div>
        </div>
        <p class="mt-1">
          By continuing you agree to our
          <a
            class="has-text-weight-medium has-text-link"
            @click="showTermsModal = true"
            >terms and conditions</a
          >
        </p>
      </div>
    </section>
    <div :class="{ modal: true, 'is-active': showTermsModal }">
      <div class="modal-background" @click="showTermsModal = false"></div>
      <div class="modal-content box">
        <h4 class="title is-4">Terms and conditions</h4>
        <p>
          These terms and conditions (&quot;Agreement&quot;) set forth the
          general terms and conditions of your use of the
          <a target="_blank" rel="nofollow" href="http://joinvoluntary.org"
            >joinvoluntary.org</a
          >
          website (&quot;Website&quot; or &quot;Service&quot;) and any of its
          related products and services (collectively, &quot;Services&quot;).
          This Agreement is legally binding between you (&quot;User&quot;,
          &quot;you&quot; or &quot;your&quot;) and this Website operator
          (&quot;Operator&quot;, &quot;we&quot;, &quot;us&quot; or
          &quot;our&quot;). By accessing and using the Website and Services, you
          acknowledge that you have read, understood, and agree to be bound by
          the terms of this Agreement. If you are entering into this Agreement
          on behalf of a business or other legal entity, you represent that you
          have the authority to bind such entity to this Agreement, in which
          case the terms &quot;User&quot;, &quot;you&quot; or &quot;your&quot;
          shall refer to such entity. If you do not have such authority, or if
          you do not agree with the terms of this Agreement, you must not accept
          this Agreement and may not access and use the Website and Services.
          You acknowledge that this Agreement is a contract between you and the
          Operator, even though it is electronic and is not physically signed by
          you, and it governs your use of the Website and Services.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Accounts and membership</h2>
        <p>
          You must be at least 13 years of age to use the Website and Services.
          By using the Website and Services and by agreeing to this Agreement
          you warrant and represent that you are at least 13 years of age. If
          you create an account on the Website, you are responsible for
          maintaining the security of your account and you are fully responsible
          for all activities that occur under the account and any other actions
          taken in connection with it. We may, but have no obligation to,
          monitor and review new accounts before you may sign in and start using
          the Services. Providing false contact information of any kind may
          result in the termination of your account. You must immediately notify
          us of any unauthorized uses of your account or any other breaches of
          security. We will not be liable for any acts or omissions by you,
          including any damages of any kind incurred as a result of such acts or
          omissions. We may suspend, disable, or delete your account (or any
          part thereof) if we determine that you have violated any provision of
          this Agreement or that your conduct or content would tend to damage
          our reputation and goodwill. If we delete your account for the
          foregoing reasons, you may not re-register for our Services. We may
          block your email address and Internet protocol address to prevent
          further registration.
        </p>
        <h2 class="title is-5 mt-4 mb-1">User content</h2>
        <p>
          We do not own any data, information or material (collectively,
          &quot;Content&quot;) that you submit on the Website in the course of
          using the Service. You shall have sole responsibility for the
          accuracy, quality, integrity, legality, reliability, appropriateness,
          and intellectual property ownership or right to use of all submitted
          Content. We may, but have no obligation to, monitor and review the
          Content on the Website submitted or created using our Services by you.
          You grant us permission to access, copy, distribute, store, transmit,
          reformat, display and perform the Content of your user account solely
          as required for the purpose of providing the Services to you. Without
          limiting any of those representations or warranties, we have the
          right, though not the obligation, to, in our own sole discretion,
          refuse or remove any Content that, in our reasonable opinion, violates
          any of our policies or is in any way harmful or objectionable. Unless
          specifically permitted by you, your use of the Website and Services
          does not grant us the license to use, reproduce, adapt, modify,
          publish or distribute the Content created by you or stored in your
          user account for commercial, marketing or any similar purpose.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Backups</h2>
        <p>
          We perform regular backups of the Website and its Content and will do
          our best to ensure completeness and accuracy of these backups. In the
          event of the hardware failure or data loss we will restore backups
          automatically to minimize the impact and downtime.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Links to other resources</h2>
        <p>
          Although the Website and Services may link to other resources (such as
          websites, mobile applications, etc.), we are not, directly or
          indirectly, implying any approval, association, sponsorship,
          endorsement, or affiliation with any linked resource, unless
          specifically stated herein. We are not responsible for examining or
          evaluating, and we do not warrant the offerings of, any businesses or
          individuals or the content of their resources. We do not assume any
          responsibility or liability for the actions, products, services, and
          content of any other third parties. You should carefully review the
          legal statements and other conditions of use of any resource which you
          access through a link on the Website and Services. Your linking to any
          other off-site resources is at your own risk.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Prohibited uses</h2>
        <p>
          In addition to other terms as set forth in the Agreement, you are
          prohibited from using the Website and Services or Content: (a) for any
          unlawful purpose; (b) to solicit others to perform or participate in
          any unlawful acts; (c) to violate any international, federal,
          provincial or state regulations, rules, laws, or local ordinances; (d)
          to infringe upon or violate our intellectual property rights or the
          intellectual property rights of others; (e) to harass, abuse, insult,
          harm, defame, slander, disparage, intimidate, or discriminate based on
          gender, sexual orientation, religion, ethnicity, race, age, national
          origin, or disability; (f) to submit false or misleading information;
          (g) to upload or transmit viruses or any other type of malicious code
          that will or may be used in any way that will affect the functionality
          or operation of the Website and Services, third party products and
          services, or the Internet; (h) to spam, phish, pharm, pretext, spider,
          crawl, or scrape; (i) for any obscene or immoral purpose; or (j) to
          interfere with or circumvent the security features of the Website and
          Services, third party products and services, or the Internet. We
          reserve the right to terminate your use of the Website and Services
          for violating any of the prohibited uses.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Intellectual property rights</h2>
        <p>
          &quot;Intellectual Property Rights&quot; means all present and future
          rights conferred by statute, common law or equity in or in relation to
          any copyright and related rights, trademarks, designs, patents,
          inventions, goodwill and the right to sue for passing off, rights to
          inventions, rights to use, and all other intellectual property rights,
          in each case whether registered or unregistered and including all
          applications and rights to apply for and be granted, rights to claim
          priority from, such rights and all similar or equivalent rights or
          forms of protection and any other results of intellectual activity
          which subsist or will subsist now or in the future in any part of the
          world. This Agreement does not transfer to you any intellectual
          property owned by the Operator or third parties, and all rights,
          titles, and interests in and to such property will remain (as between
          the parties) solely with the Operator. All trademarks, service marks,
          graphics and logos used in connection with the Website and Services,
          are trademarks or registered trademarks of the Operator or its
          licensors. Other trademarks, service marks, graphics and logos used in
          connection with the Website and Services may be the trademarks of
          other third parties. Your use of the Website and Services grants you
          no right or license to reproduce or otherwise use any of the Operator
          or third party trademarks.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Changes and amendments</h2>
        <p>
          We reserve the right to modify this Agreement or its terms relating to
          the Website and Services at any time, effective upon posting of an
          updated version of this Agreement on the Website. When we do, we will
          revise the updated date at the bottom of this page. Continued use of
          the Website and Services after any such changes shall constitute your
          consent to such changes. Policy was created with
          <a
            style="color:inherit"
            target="_blank"
            href="https://www.websitepolicies.com/terms-and-conditions-generator"
            >WebsitePolicies</a
          >.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Acceptance of these terms</h2>
        <p>
          You acknowledge that you have read this Agreement and agree to all its
          terms and conditions. By accessing and using the Website and Services
          you agree to be bound by this Agreement. If you do not agree to abide
          by the terms of this Agreement, you are not authorized to access or
          use the Website and Services.
        </p>
        <h2 class="title is-5 mt-4 mb-1">Contacting us</h2>
        <p>
          If you would like to contact us to understand more about this
          Agreement or wish to contact us concerning any matter relating to it,
          you may send an email to
          sre&#121;&#97;&#115;.v&#111;&#114;&#117;ga&#110;&#116;&#105;&#64;&#103;&#109;ai&#108;&#46;c&#111;m
        </p>
        <p class="has-text-weight-medium mt-3">
          This document was last updated on February 12, 2021
        </p>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showTermsModal = false"
      ></button>
    </div>
    <div :class="{ modal: true, 'is-active': showTypeModal }">
      <div class="modal-background" @click="showTypeModal = false"></div>
      <div class="modal-content box">
        <h4 class="title is-4">About Account Types</h4>
        <p>
          Your account type is either a client or mentor, choose client if you
          want to just take sessions from mentors, otherwise choose mentor to
          take sessions, and offer your own sessions through a service.
        </p>
        <p class="has-text-weight-medium mt-2">
          *Your account type can be changed from your account settings.
        </p>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showTypeModal = false"
      ></button>
    </div>
  </div>
</template>

<script>
import config from "../../../config";
export default {
  name: "Auth",
  data() {
    return {
      showTermsModal: false,
      showTypeModal: false,
      accType: "choose",
    };
  },
  computed: {
    getUrl() {
      const sp = new URLSearchParams(
        `client_id=836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com&redirect_uri=${config.baseUrl}/auth/google&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&prompt=consent`
      );
      const state = {
        redirect: this.$route.query.r,
        acc_type: this.accType,
      };
      if (Object.keys(state).length > 0)
        sp.append("state", JSON.stringify(state));
      return "https://accounts.google.com/o/oauth2/v2/auth?" + sp.toString();
    },
  },
  methods: {
    onClick() {
      window.location.href = this.getUrl;
    },
  },
};
</script>
