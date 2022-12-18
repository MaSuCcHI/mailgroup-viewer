import styled from 'styled-components'

type Props = {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}

export default styled.div<Props>`
  margin: 0;
  top: ${(props) => props.top || 'auto'};
  right: ${(props) => props.right || 'auto'};
  bottom: ${(props) => props.bottom || 'auto'};
  left: ${(props) => props.left || 'auto'};
  position: fixed;
`