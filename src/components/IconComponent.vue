<script>
import { h } from "vue";
import InlineSvg from "vue-inline-svg";

export default {
  name: "IconComponent",
  props: {
    name: String,
  },
  setup(props) {
    let error = false;
    let template = false;
    if (!error) {
      template = h(
        "figure",
        {
          class: `icon ${props.name}-icon`,
        },
        h(InlineSvg, {
          src: `/assets/svg/${props.name}.svg`,
          onError: () => {
            error = true;
          },
        })
      );
    }
    return () => template;
  },
  data: () => ({
    error: false,
  }),
};
</script>
