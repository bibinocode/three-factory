attribute vec3 aPosition;
uniform float uTime;
void main(){
  // 当前位置
  vec4 currentPosition =  modelMatrix * vec4(position,1.0);
  // 方向= 终点位置 - 起始位置
  vec3 direction = aPosition - currentPosition.xyz;
  // 随着时间从起始位置移动到终点位置
  vec3 targetPosition = currentPosition.xyz + direction * 0.1 * uTime;
  vec4 vPosition = viewMatrix * vec4(targetPosition,1.0); // 相机视角
  gl_Position = projectionMatrix * vPosition;
  gl_PointSize = -100.0 / vPosition.z; // 进大远小,z轴是我们的视角,并且应该是负增长
}